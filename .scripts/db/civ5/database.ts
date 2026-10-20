import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { NormalizedResource } from './types';

export interface DatabaseSummary {
    resources: number;
    localizations: number;
}

const finalSchemaPath = resolve(process.cwd(), '.scripts/db/civ5/schema.sql');
const stagingSchemaPath = resolve(process.cwd(), '.scripts/db/civ5/staging-schema.sql');

function createDatabase(path: string, schemaPath: string): DatabaseSync {
    const database = new DatabaseSync(path);
    database.exec(readFileSync(schemaPath, 'utf8'));
    return database;
}

export function createStagingDatabase(path: string): DatabaseSync {
    return createDatabase(path, stagingSchemaPath);
}

export function createFinalDatabase(path: string): DatabaseSync {
    return createDatabase(path, finalSchemaPath);
}

function lastInsertId(database: DatabaseSync): number {
    const row = database.prepare('SELECT last_insert_rowid() AS id').get() as
        { id: number | bigint } | undefined;
    if (!row) throw new Error('SQLite did not return an inserted row id');
    return Number(row.id);
}

export function writeDatabase(
    path: string,
    dataset: readonly NormalizedResource[]
): DatabaseSummary {
    const database = createStagingDatabase(path);
    try {
        database.exec('BEGIN');
        database
            .prepare(
                'INSERT INTO imports (game_id, source_url, imported_at, schema_version) VALUES (?, ?, ?, ?)'
            )
            .run(
                'civilization-5',
                'https://eyefyre.github.io/civvapi',
                new Date().toISOString(),
                1
            );
        const importId = lastInsertId(database);
        const resourceIds = new Map<string, number>();
        const insertResource = database.prepare(
            'INSERT INTO resources (import_id, kind, resource_key) VALUES (?, ?, ?)'
        );
        const insertLocalization = database.prepare(
            'INSERT INTO resource_localizations (resource_id, language, source_url, name, payload_json) VALUES (?, ?, ?, ?, ?)'
        );

        for (const resource of dataset) {
            let resourceId = resourceIds.get(resource.resourceKey);
            if (resourceId === undefined) {
                insertResource.run(importId, resource.kind, resource.resourceKey);
                resourceId = lastInsertId(database);
                resourceIds.set(resource.resourceKey, resourceId);
            }
            insertLocalization.run(
                resourceId,
                resource.language,
                resource.sourceUrl,
                resource.name,
                JSON.stringify(resource.payload)
            );
        }
        database.exec('COMMIT');
        return { resources: resourceIds.size, localizations: dataset.length };
    } catch (error) {
        database.exec('ROLLBACK');
        throw error;
    } finally {
        database.close();
    }
}
