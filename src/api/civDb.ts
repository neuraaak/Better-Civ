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
import type { CivApiDto, YieldDto } from './civApi';

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

// CivVAPI never links an improvement to the civilization it belongs to
// (`required_civ` is null on every row), so the pairs are listed here, by
// entity code rather than by name, which no translation changes.
const CIVILIZATION_IMPROVEMENTS: Readonly<Record<string, string>> = {
    'civilizations/brazil': 'improvements/brazilwood_camp',
    'civilizations/france': 'improvements/chateau',
    'civilizations/morocco': 'improvements/kasbah',
    'civilizations/polynesia': 'improvements/moai',
    'civilizations/portugal': 'improvements/feitoria',
    'civilizations/the_inca': 'improvements/terrace_farm',
    'civilizations/the_netherlands': 'improvements/polder',
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
    description?: string;
    strategy?: string;
    tech?: string;
    cost?: number;
    movement?: number;
    upkeep?: number;
    yields?: YieldDto[];
    terrains?: string[];
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
    SELECT e.id AS entity_id, e.source_id AS id, e.code AS code, t.name AS name, c.icon AS icon,
           t.dawn_of_man AS dawn_of_man,
           l.name AS leader_name, l.icon AS leader_icon, l.subtitle AS subtitle,
           l.trait_name AS trait_name, l.trait_effect AS trait_effect,
           l.historical_heading AS historical_heading, l.historical_text AS historical_text
    FROM civilizations c
    JOIN entities e ON e.id = c.entity_id
    JOIN translations t ON t.entity_id = c.entity_id AND t.language = $lang
    LEFT JOIN civilization_leaders l ON l.civilization_id = c.entity_id AND l.language = $lang
    ORDER BY e.source_id`;

// A unit, a building and an improvement all unlock through `tech_unlocks`; an
// entity that several technologies unlock keeps the first one.
const TECH_SQL = `(SELECT tt.name FROM tech_unlocks tu
        JOIN translations tt ON tt.entity_id = tu.tech_id AND tt.language = $lang
        WHERE tu.entity_id = %s LIMIT 1) AS tech`;

const UNIQUE_UNITS_SQL = `
    SELECT u.civilization_id AS civilization_id, t.name AS name, e.code AS code,
           (SELECT icon FROM units WHERE entity_id = u.unit_id) AS icon,
           (SELECT cost FROM units WHERE entity_id = u.unit_id) AS cost,
           (SELECT movement FROM units WHERE entity_id = u.unit_id) AS movement,
           t.game_info AS description, t.strategy AS strategy,
           ${TECH_SQL.replace('%s', 'u.unit_id')}
    FROM civilization_unique_units u
    JOIN entities e ON e.id = u.unit_id
    JOIN translations t ON t.entity_id = u.unit_id AND t.language = $lang`;

const UNIQUE_BUILDINGS_SQL = `
    SELECT u.civilization_id AS civilization_id, t.name AS name, e.code AS code,
           b.icon AS icon, b.cost AS cost, b.gold_maintenance AS upkeep,
           t.game_info AS description, t.strategy AS strategy,
           ${TECH_SQL.replace('%s', 'u.building_id')}
    FROM civilization_unique_buildings u
    JOIN buildings b ON b.entity_id = u.building_id
    JOIN entities e ON e.id = u.building_id
    JOIN translations t ON t.entity_id = u.building_id AND t.language = $lang`;

const IMPROVEMENTS_SQL = `
    SELECT e.code AS code, t.name AS name, i.icon AS icon,
           t.game_info AS description, t.strategy AS strategy,
           ${TECH_SQL.replace('%s', 'i.entity_id')}
    FROM improvements i
    JOIN entities e ON e.id = i.entity_id
    JOIN translations t ON t.entity_id = i.entity_id AND t.language = $lang`;

const YIELDS_SQL = `
    SELECT e.code AS code, y.yield_type AS type, y.amount AS amount
    FROM entity_yields y
    JOIN entities e ON e.id = y.entity_id
    ORDER BY y.yield_type`;

const IMPROVEMENT_TERRAINS_SQL = `
    SELECT e.code AS code, t.name AS name
    FROM improvement_buildable_terrains b
    JOIN entities e ON e.id = b.improvement_id
    JOIN translations t ON t.entity_id = b.terrain_id AND t.language = $lang`;

/** `null` and non-numeric columns become `undefined`: an absent row, not a zero. */
function optionalNumber(value: unknown): number | undefined {
    return typeof value === 'number' ? value : undefined;
}

function optionalText(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
}

function itemOf(
    row: Record<string, unknown>,
    yields: Map<string, YieldDto[]>,
    terrains?: Map<string, string[]>
): UniqueItem {
    const code = row.code as string | undefined;
    return {
        // A name is TEXT in the schema; anything else is a corrupt row, not a label.
        name: typeof row.name === 'string' ? row.name : '',
        // Upstream leaves the `specialists/` unique units without an icon.
        icon: assetUrl(row.icon as string | null) || localIconUrl(code),
        description: optionalText(row.description),
        strategy: optionalText(row.strategy),
        tech: optionalText(row.tech),
        cost: optionalNumber(row.cost),
        movement: optionalNumber(row.movement),
        upkeep: optionalNumber(row.upkeep),
        yields: code ? yields.get(code) : undefined,
        terrains: code ? terrains?.get(code) : undefined,
    };
}

function groupByCivilization(
    database: Database,
    sql: string,
    lang: Lang,
    yields: Map<string, YieldDto[]>
): Map<number, UniqueItem[]> {
    const grouped = new Map<number, UniqueItem[]>();
    for (const row of rows(database, sql, { $lang: lang })) {
        const key = Number(row.civilization_id);
        const items = grouped.get(key) ?? [];
        items.push(itemOf(row, yields));
        grouped.set(key, items);
    }
    return grouped;
}

/** Yields of every entity that has some, keyed by entity code. */
function yieldsByCode(database: Database): Map<string, YieldDto[]> {
    const grouped = new Map<string, YieldDto[]>();
    for (const row of rows(database, YIELDS_SQL, {})) {
        const code = String(row.code);
        const list = grouped.get(code) ?? [];
        list.push({ type: String(row.type), amount: Number(row.amount) });
        grouped.set(code, list);
    }
    return grouped;
}

/** The unique improvement of each civilization, keyed by civilization code. */
function improvementsByCivilization(
    database: Database,
    lang: Lang,
    yields: Map<string, YieldDto[]>
): Map<string, UniqueItem> {
    const terrains = new Map<string, string[]>();
    for (const row of rows(database, IMPROVEMENT_TERRAINS_SQL, { $lang: lang })) {
        const code = String(row.code);
        terrains.set(code, [...(terrains.get(code) ?? []), String(row.name)]);
    }
    const byCode = new Map<string, UniqueItem>();
    for (const row of rows(database, IMPROVEMENTS_SQL, { $lang: lang })) {
        byCode.set(String(row.code), itemOf(row, yields, terrains));
    }
    const byCivilization = new Map<string, UniqueItem>();
    for (const [civilization, improvement] of Object.entries(CIVILIZATION_IMPROVEMENTS)) {
        const item = byCode.get(improvement);
        if (item) byCivilization.set(civilization, item);
    }
    return byCivilization;
}

/**
 * Reads the civilization list for `lang` in the DTO shape the components
 * already consume, with every icon pointing at the R2 WebP mirror.
 */
export async function fetchCivilizations(lang: Lang, signal?: AbortSignal): Promise<CivApiDto[]> {
    const database = await loadDatabase(signal);
    const yields = yieldsByCode(database);
    const units = groupByCivilization(database, UNIQUE_UNITS_SQL, lang, yields);
    const buildings = groupByCivilization(database, UNIQUE_BUILDINGS_SQL, lang, yields);
    const improvements = improvementsByCivilization(database, lang, yields);

    return rows(database, CIVILIZATIONS_SQL, { $lang: lang })
        .filter(row => Number.isInteger(row.id) && typeof row.name === 'string')
        .map(row => {
            const entityId = Number(row.entity_id);
            const leaderText = row.historical_text as string | null;
            // CivVAPI gives a civilization no `historical_info` of its own; its
            // only prose is the game's Dawn of Man intro, which the panel's
            // history section shows.
            const dawnOfMan = row.dawn_of_man as string | null;
            return {
                id: Number(row.id),
                name: String(row.name),
                icon: assetUrl(row.icon as string | null),
                historical_info: dawnOfMan ? [{ text: dawnOfMan }] : [],
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
                unique_improvements: [improvements.get(String(row.code))].filter(
                    (item): item is UniqueItem => item !== undefined
                ),
            };
        });
}
