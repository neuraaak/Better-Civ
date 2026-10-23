/**
 * Civ V data source: the SQLite artifact published on R2, read in the browser
 * through sql.js. The database is downloaded once, checked against its
 * manifest and kept in the Cache API, so a reload costs nothing.
 */
import initSqlJs, { type Database } from 'sql.js';
// Vite resolves the `?url` suffix at build time; TypeScript cannot type a
// package subpath carrying a query, and has no fallback for one.
// @ts-expect-error -- see above
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { Lang } from '../i18n/languages';
import type { CivApiDto } from './civApi';

// CONSTANTS
// ##############
const ARTIFACT_BASE = 'https://repository.neuraaak.fr/better-civ/civilization-5';
const DATABASE_URL = `${ARTIFACT_BASE}/civilization-5.sqlite`;
const MANIFEST_URL = `${ARTIFACT_BASE}/civilization-5.manifest.json`;
/** Icon URLs are stored as published upstream; the R2 mirror serves WebP. */
const UPSTREAM_IMAGE_BASE = 'https://eyefyre.github.io/civvapi/images/';
const CACHE_NAME = 'civ5-database';
const SCHEMA_VERSION = 2;

// CivVAPI publishes these two unique units under `specialists/`, a family that
// carries no icon, so the database holds none. The assets are ours, not
// upstream: see `.scripts/db/civ5/assets/`. Listed one by one rather than
// derived from the code, so a future upstream gap renders nothing instead of a
// broken image.
const LOCAL_ICONS: Readonly<Record<string, string>> = {
    'specialists/khan': 'unit_icons/khan.webp',
    'specialists/merchant_of_venice': 'unit_icons/merchant_of_venice.webp',
};

// TYPES
// ##############
export interface DatabaseManifest {
    schema_version: number;
    size_bytes: number;
    sha256: string;
}

interface UniqueItem {
    name: string;
    icon: string;
}

// FUNCTIONS
// ##############
/** Rewrites an upstream `.png` icon URL to its R2 `.webp` mirror. */
export function assetUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (!url.startsWith(UPSTREAM_IMAGE_BASE)) return url;
    const path = url.slice(UPSTREAM_IMAGE_BASE.length).replace(/\.png$/, '.webp');
    return `${ARTIFACT_BASE}/images/${path}`;
}

/** Icon of an entity the upstream API leaves without one, if we supply it. */
export function localIconUrl(code: string | null | undefined): string {
    const path = code ? LOCAL_ICONS[code] : undefined;
    return path === undefined ? '' : `${ARTIFACT_BASE}/images/${path}`;
}

export function parseManifest(payload: unknown): DatabaseManifest {
    const candidate = payload as Record<string, unknown> | null;
    if (
        typeof candidate?.sha256 !== 'string' ||
        !Number.isInteger(candidate.size_bytes) ||
        candidate.schema_version !== SCHEMA_VERSION
    ) {
        throw new TypeError(`Unusable manifest: expected schema version ${SCHEMA_VERSION}`);
    }
    return candidate as unknown as DatabaseManifest;
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/** The Cache API is unavailable on an insecure origin and under jsdom. */
async function openCache(): Promise<Cache | null> {
    if (typeof caches === 'undefined') return null;
    try {
        return await caches.open(CACHE_NAME);
    } catch {
        return null;
    }
}

async function downloadDatabase(
    manifest: DatabaseManifest,
    signal?: AbortSignal
): Promise<ArrayBuffer> {
    // The digest keys the cache entry, so a republished database misses and refetches.
    const cacheKey = `${DATABASE_URL}#${manifest.sha256}`;
    const cache = await openCache();
    const cached = await cache?.match(cacheKey);
    if (cached) return await cached.arrayBuffer();

    const response = await fetch(DATABASE_URL, { signal });
    if (!response.ok) throw new Error(`Database download failed with HTTP ${response.status}`);
    const bytes = await response.arrayBuffer();

    if (bytes.byteLength !== manifest.size_bytes) {
        throw new Error(`Database size mismatch: ${bytes.byteLength} vs ${manifest.size_bytes}`);
    }
    const digest = await sha256Hex(bytes);
    if (digest !== manifest.sha256) {
        throw new Error(`Database digest mismatch: ${digest} vs ${manifest.sha256}`);
    }

    await cache?.put(cacheKey, new Response(bytes));
    return bytes;
}

let pending: Promise<Database> | null = null;

/** Opens the published database once per page; a failure clears the cached promise. */
export function loadDatabase(signal?: AbortSignal): Promise<Database> {
    pending ??= (async () => {
        const response = await fetch(MANIFEST_URL, { signal });
        if (!response.ok) throw new Error(`Manifest download failed with HTTP ${response.status}`);
        const manifest = parseManifest(await response.json());
        const [SQL, bytes] = await Promise.all([
            initSqlJs({ locateFile: () => wasmUrl }),
            downloadDatabase(manifest, signal),
        ]);
        return new SQL.Database(new Uint8Array(bytes));
    })().catch((error: unknown) => {
        pending = null;
        throw error;
    });
    return pending;
}

export function resetDatabase(): void {
    pending = null;
}

function rows(
    database: Database,
    sql: string,
    params: Record<string, string>
): Record<string, unknown>[] {
    const statement = database.prepare(sql);
    statement.bind(params);
    const result: Record<string, unknown>[] = [];
    while (statement.step()) result.push(statement.getAsObject());
    statement.free();
    return result;
}

const CIVILIZATIONS_SQL = `
    SELECT e.id AS entity_id, e.source_id AS id, t.name AS name, c.icon AS icon,
           l.name AS leader_name, l.icon AS leader_icon, l.subtitle AS subtitle,
           l.trait_name AS trait_name, l.trait_effect AS trait_effect,
           l.historical_heading AS historical_heading, l.historical_text AS historical_text
    FROM civilizations c
    JOIN entities e ON e.id = c.entity_id
    JOIN translations t ON t.entity_id = c.entity_id AND t.language = $lang
    LEFT JOIN civilization_leaders l ON l.civilization_id = c.entity_id AND l.language = $lang
    ORDER BY e.source_id`;

const UNIQUE_UNITS_SQL = `
    SELECT u.civilization_id AS civilization_id, t.name AS name, e.code AS code,
           (SELECT icon FROM units WHERE entity_id = u.unit_id) AS icon
    FROM civilization_unique_units u
    JOIN entities e ON e.id = u.unit_id
    JOIN translations t ON t.entity_id = u.unit_id AND t.language = $lang`;

const UNIQUE_BUILDINGS_SQL = `
    SELECT u.civilization_id AS civilization_id, t.name AS name, b.icon AS icon
    FROM civilization_unique_buildings u
    JOIN buildings b ON b.entity_id = u.building_id
    JOIN translations t ON t.entity_id = u.building_id AND t.language = $lang`;

function groupByCivilization(
    database: Database,
    sql: string,
    lang: Lang
): Map<number, UniqueItem[]> {
    const grouped = new Map<number, UniqueItem[]>();
    for (const row of rows(database, sql, { $lang: lang })) {
        const key = Number(row.civilization_id);
        const items = grouped.get(key) ?? [];
        const icon =
            assetUrl(row.icon as string | null) ||
            // Only the unique-unit query selects a code; buildings never need a fallback.
            localIconUrl(row.code as string | undefined);
        items.push({ name: String(row.name ?? ''), icon });
        grouped.set(key, items);
    }
    return grouped;
}

/**
 * Reads the civilization list for `lang` in the DTO shape the components
 * already consume, with every icon pointing at the R2 WebP mirror.
 */
export async function fetchCivilizations(lang: Lang, signal?: AbortSignal): Promise<CivApiDto[]> {
    const database = await loadDatabase(signal);
    const units = groupByCivilization(database, UNIQUE_UNITS_SQL, lang);
    const buildings = groupByCivilization(database, UNIQUE_BUILDINGS_SQL, lang);

    return rows(database, CIVILIZATIONS_SQL, { $lang: lang })
        .filter(row => Number.isInteger(row.id) && typeof row.name === 'string')
        .map(row => {
            const entityId = Number(row.entity_id);
            const leaderText = row.historical_text as string | null;
            return {
                id: Number(row.id),
                name: String(row.name),
                icon: assetUrl(row.icon as string | null),
                leader: {
                    name: (row.leader_name as string | null) ?? undefined,
                    icon: assetUrl(row.leader_icon as string | null),
                    subtitle: (row.subtitle as string | null) ?? undefined,
                    trait: {
                        name: (row.trait_name as string | null) ?? undefined,
                        effect: (row.trait_effect as string | null) ?? undefined,
                    },
                    historical_info: leaderText
                        ? [
                              {
                                  heading: (row.historical_heading as string | null) ?? undefined,
                                  text: leaderText,
                              },
                          ]
                        : [],
                },
                unique_units: units.get(entityId) ?? [],
                unique_buildings: buildings.get(entityId) ?? [],
            };
        });
}
