import { DatabaseSync } from 'node:sqlite';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createFetchBinary, type FetchBinary } from '../shared/http-client';

export interface ImageSummary {
    total: number;
    downloaded: number;
    skipped: number;
    missing: string[];
}

export interface DownloadOptions {
    databasePath: string;
    outputDirectory: string;
    fetchBinary: FetchBinary;
    concurrency?: number;
}

const IMAGE_COLUMNS: readonly (readonly [string, string])[] = [
    ['buildings', 'icon'],
    ['civilization_leaders', 'icon'],
    ['civilizations', 'icon'],
    ['features', 'icon'],
    ['improvements', 'icon'],
    ['policies', 'icon'],
    ['resources', 'icon'],
    ['techs', 'icon'],
    ['terrains', 'icon'],
    ['units', 'icon'],
    ['wonders', 'background_image'],
    ['wonders', 'icon'],
];

// Upstream names collide across folders (wonder_icons/alhambra.png vs
// wonder_backgrounds/alhambra.png), so the CivVAPI layout is mirrored as-is.
// Apostrophes appear in a handful of upstream names (satrap's_court.png).
const IMAGE_URL =
    /^https:\/\/eyefyre\.github\.io\/civvapi\/images\/([a-z0-9_]+)\/([a-z0-9_.'-]+\.png)$/;

// CivVAPI publishes three assets under a misspelled name; the database holds
// the correct spelling, so the request is retargeted and the file kept as named.
const UPSTREAM_TYPOS: Readonly<Record<string, string>> = {
    'resource_icons/cotton.png': 'resource_icons/cottom.png',
    'resource_icons/jewelry.png': 'resource_icons/jewelery.png',
    'wonder_backgrounds/alhambra.png': 'wonder_backgrounds/alahambra.png',
};

export function sourceUrlFor(url: string): string {
    const path = imagePathFor(url);
    const actual = UPSTREAM_TYPOS[path];
    return actual === undefined ? url : url.replace(path, actual);
}

export function imagePathFor(url: string): string {
    const match = IMAGE_URL.exec(url);
    if (!match) throw new Error(`Unexpected CivVAPI image URL: ${url}`);
    return `${match[1]}/${match[2]}`;
}

export function collectImageUrls(database: DatabaseSync): string[] {
    const urls = new Set<string>();
    for (const [table, column] of IMAGE_COLUMNS) {
        const rows = database
            .prepare(
                `SELECT DISTINCT ${column} AS url FROM ${table} WHERE ${column} IS NOT NULL AND TRIM(${column}) <> ''`
            )
            .all() as { url: string }[];
        for (const row of rows) urls.add(row.url);
    }
    return [...urls].sort();
}

async function writeImage(
    url: string,
    target: string,
    fetchBinary: FetchBinary,
    controller: AbortController
): Promise<boolean> {
    const contents = await fetchBinary(url, controller.signal);
    if (contents === null) return false;
    if (contents.length === 0) throw new Error(`CivVAPI returned an empty image for ${url}`);
    await mkdir(dirname(target), { recursive: true });
    const staged = `${target}.tmp`;
    try {
        await writeFile(staged, contents);
        await rename(staged, target);
    } catch (error) {
        await rm(staged, { force: true });
        throw error;
    }
    return true;
}

export async function downloadCiv5Images(options: DownloadOptions): Promise<ImageSummary> {
    const database = new DatabaseSync(options.databasePath, { readOnly: true });
    let urls: string[];
    try {
        urls = collectImageUrls(database);
    } finally {
        database.close();
    }

    const pending = urls.filter(
        url => !existsSync(join(options.outputDirectory, imagePathFor(url)))
    );
    const controller = new AbortController();
    const missing: string[] = [];
    let next = 0;
    const worker = async (): Promise<void> => {
        while (next < pending.length) {
            const url = pending[next++];
            const written = await writeImage(
                sourceUrlFor(url),
                join(options.outputDirectory, imagePathFor(url)),
                options.fetchBinary,
                controller
            );
            if (!written) missing.push(url);
        }
    };
    try {
        await Promise.all(
            Array.from({ length: Math.min(options.concurrency ?? 8, pending.length || 1) }, worker)
        );
    } catch (error) {
        controller.abort();
        throw error;
    }

    return {
        total: urls.length,
        downloaded: pending.length - missing.length,
        skipped: urls.length - pending.length,
        missing: missing.sort(),
    };
}

export async function main(): Promise<void> {
    const summary = await downloadCiv5Images({
        databasePath: join(process.cwd(), 'bin', 'assets', 'db', 'civilization-5.sqlite'),
        outputDirectory: join(process.cwd(), 'bin', 'assets', 'images'),
        fetchBinary: createFetchBinary(),
    });
    console.log(
        `Downloaded ${summary.downloaded} images (${summary.skipped} already present, ${summary.total} referenced).`
    );
    if (summary.missing.length > 0) {
        console.warn(`Absent upstream (${summary.missing.length}):`);
        for (const url of summary.missing) console.warn(`  ${url}`);
    }
}

if (import.meta.main) {
    main().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}
