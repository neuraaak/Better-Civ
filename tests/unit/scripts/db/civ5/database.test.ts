import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { writeDatabase } from '../../../../../.scripts/db/civ5/database';
import { createManifest } from '../../../../../.scripts/db/civ5/manifest';

const temporaryDirectories: string[] = [];

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true });
});

describe('createManifest', () => {
    it('records the generated database size and SHA-256', async () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-'));
        temporaryDirectories.push(directory);
        const databasePath = join(directory, 'civilization-5.sqlite');
        writeFileSync(databasePath, 'sqlite data');

        await expect(createManifest(databasePath, 1, 'civvapi-v1')).resolves.toMatchObject({
            schema_version: 1,
            dataset_version: 'civvapi-v1',
            size_bytes: 11,
            sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
        });
    });
});

describe('writeDatabase', () => {
    it('stores localized JSON without interpreting its text as SQL', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-'));
        temporaryDirectories.push(directory);
        const databasePath = join(directory, 'civilization-5.sqlite');
        const payload = { name: "L'Amérique", note: "'); DROP TABLE resources; --" };

        writeDatabase(databasePath, [
            {
                kind: 'civilizations',
                language: 'fr',
                resourceKey: 'civilizations/america',
                sourceUrl: 'https://eyefyre.github.io/civvapi/v1/fr/civilizations/america.json',
                name: "L'Amérique",
                payload,
            },
        ]);

        const database = new DatabaseSync(databasePath);
        const row = database
            .prepare(
                `SELECT payload_json FROM resource_localizations
                 JOIN resources ON resources.id = resource_localizations.resource_id
                 WHERE resources.resource_key = ? AND resource_localizations.language = ?`
            )
            .get('civilizations/america', 'fr') as { payload_json: string };
        database.close();

        expect(row.payload_json).toBe(JSON.stringify(payload));
    });
});
