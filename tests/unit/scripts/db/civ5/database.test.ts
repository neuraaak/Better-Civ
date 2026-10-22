import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
    createFinalDatabase,
    createStagingDatabase,
    writeDatabase,
} from '../../../../../.scripts/db/civ5/database';
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

describe('database schemas', () => {
    it('keeps raw documents in staging and exposes only curated tables in the final database', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-'));
        temporaryDirectories.push(directory);
        const staging = createStagingDatabase(join(directory, 'staging.sqlite'));
        const final = createFinalDatabase(join(directory, 'final.sqlite'));
        const tableNames = (database: DatabaseSync) =>
            new Set(
                (
                    database
                        .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
                        .all() as {
                        name: string;
                    }[]
                ).map(row => row.name)
            );

        const stagingTables = tableNames(staging);
        const finalTables = tableNames(final);
        staging.close();
        final.close();

        expect(stagingTables.has('resource_localizations')).toBe(true);
        expect([...finalTables]).toEqual(
            expect.arrayContaining([
                'entities',
                'translations',
                'entity_yields',
                'civilizations',
                'beliefs',
                'policies',
                'units',
                'buildings',
                'wonders',
                'techs',
                'promotions',
                'resources',
                'improvements',
                'terrains',
                'features',
                'religions',
                'citystates',
                'resolutions',
                'specialists',
                'civilization_city_names',
                'civilization_spy_names',
                'policy_prerequisites',
                'unit_promotions',
                'tech_unlocks',
                'promotion_prerequisites',
                'resource_revealing_techs',
                'improvement_buildable_terrains',
                'improvement_resources',
                'terrain_features',
                'terrain_resources',
                'feature_resources',
            ])
        );
        expect(finalTables.has('payload_json')).toBe(false);
        expect(finalTables.has('resource_localizations')).toBe(false);
        expect(finalTables.has('resource_relations')).toBe(false);
    });
});
