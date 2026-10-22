import { DatabaseSync } from 'node:sqlite';
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createFinalDatabase } from '../../../../../.scripts/db/civ5/database';
import {
    collectImageUrls,
    downloadCiv5Images,
    imagePathFor,
    sourceUrlFor,
} from '../../../../../.scripts/db/civ5/images';

const temporaryDirectories: string[] = [];

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true });
});

const ROOT = 'https://eyefyre.github.io/civvapi/images';

function directory(): string {
    const created = mkdtempSync(join(tmpdir(), 'better-civ-images-'));
    temporaryDirectories.push(created);
    return created;
}

function populate(databasePath: string): void {
    const database = createFinalDatabase(databasePath);
    database.exec(`
        INSERT INTO entities (id, type, code) VALUES (1, 'wonders', 'wonders/alhambra'), (2, 'units', 'units/warrior');
        INSERT INTO wonders (entity_id, icon, background_image)
            VALUES (1, '${ROOT}/wonder_icons/alhambra.png', '${ROOT}/wonder_backgrounds/alhambra.png');
        INSERT INTO units (entity_id, icon) VALUES (2, '${ROOT}/unit_icons/warrior.png');
    `);
    database.close();
}

describe('imagePathFor', () => {
    it('mirrors the upstream folder so same-named assets never collide', () => {
        expect(imagePathFor(`${ROOT}/wonder_icons/alhambra.png`)).toBe('wonder_icons/alhambra.png');
        expect(imagePathFor(`${ROOT}/wonder_backgrounds/alhambra.png`)).toBe(
            'wonder_backgrounds/alhambra.png'
        );
        expect(imagePathFor(`${ROOT}/building_icons/satrap's_court.png`)).toBe(
            "building_icons/satrap's_court.png"
        );
    });

    it('rejects a URL outside the CivVAPI image tree', () => {
        expect(() => imagePathFor(`${ROOT}/../../etc/passwd.png`)).toThrow(/Unexpected/);
        expect(() => imagePathFor('https://example.com/images/unit_icons/warrior.png')).toThrow(
            /Unexpected/
        );
    });
});

describe('sourceUrlFor', () => {
    it('requests the misspelled name CivVAPI actually publishes', () => {
        expect(sourceUrlFor(`${ROOT}/resource_icons/cotton.png`)).toBe(
            `${ROOT}/resource_icons/cottom.png`
        );
        expect(sourceUrlFor(`${ROOT}/wonder_backgrounds/alhambra.png`)).toBe(
            `${ROOT}/wonder_backgrounds/alahambra.png`
        );
    });

    it('leaves every correctly spelled asset untouched', () => {
        expect(sourceUrlFor(`${ROOT}/unit_icons/warrior.png`)).toBe(
            `${ROOT}/unit_icons/warrior.png`
        );
    });
});

describe('collectImageUrls', () => {
    it('reads every image column, including wonder backgrounds', () => {
        const databasePath = join(directory(), 'final.sqlite');
        populate(databasePath);
        const database = new DatabaseSync(databasePath, { readOnly: true });

        expect(collectImageUrls(database)).toEqual([
            `${ROOT}/unit_icons/warrior.png`,
            `${ROOT}/wonder_backgrounds/alhambra.png`,
            `${ROOT}/wonder_icons/alhambra.png`,
        ]);
        database.close();
    });
});

describe('downloadCiv5Images', () => {
    it('writes new images, skips present ones and reports upstream gaps', async () => {
        const workspace = directory();
        const databasePath = join(workspace, 'final.sqlite');
        const outputDirectory = join(workspace, 'images');
        populate(databasePath);
        mkdirSync(join(outputDirectory, 'unit_icons'), { recursive: true });
        writeFileSync(join(outputDirectory, 'unit_icons', 'warrior.png'), 'kept');
        const requested: string[] = [];

        const summary = await downloadCiv5Images({
            databasePath,
            outputDirectory,
            concurrency: 2,
            fetchBinary: async url => {
                requested.push(url);
                if (url.includes('wonder_backgrounds')) return null;
                return new Uint8Array([1, 2, 3]);
            },
        });

        expect(summary).toEqual({
            total: 3,
            downloaded: 1,
            skipped: 1,
            missing: [`${ROOT}/wonder_backgrounds/alhambra.png`],
        });
        expect(requested).not.toContain(`${ROOT}/unit_icons/warrior.png`);
        expect(readFileSync(join(outputDirectory, 'unit_icons', 'warrior.png'), 'utf8')).toBe(
            'kept'
        );
        expect([...readFileSync(join(outputDirectory, 'wonder_icons', 'alhambra.png'))]).toEqual([
            1, 2, 3,
        ]);
        expect(readdirSync(join(outputDirectory, 'wonder_icons'))).toEqual(['alhambra.png']);
    });

    it('leaves no partial file behind when a download fails', async () => {
        const workspace = directory();
        const databasePath = join(workspace, 'final.sqlite');
        const outputDirectory = join(workspace, 'images');
        populate(databasePath);

        await expect(
            downloadCiv5Images({
                databasePath,
                outputDirectory,
                concurrency: 1,
                fetchBinary: async () => {
                    throw new Error('civvapi responded with HTTP 500');
                },
            })
        ).rejects.toThrow(/HTTP 500/);
        expect(existsSync(outputDirectory)).toBe(false);
    });
});
