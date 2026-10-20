import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractResourceRelations } from './lib/relations';
import type { NormalizedResource } from './types';

export interface DatabaseSummary {
    resources: number;
    localizations: number;
}

const schemaPath = resolve(process.cwd(), '.scripts/db/civ5/schema.sql');

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
    const database = new DatabaseSync(path);
    try {
        database.exec(readFileSync(schemaPath, 'utf8'));
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
        const insertRelation = database.prepare(
            'INSERT OR IGNORE INTO resource_relations (source_resource_id, target_kind, target_resource_key, relation_path, position) VALUES (?, ?, ?, ?, ?)'
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
            for (const relation of extractResourceRelations(resource.payload)) {
                if (relation.targetKey !== resource.resourceKey) {
                    insertRelation.run(
                        resourceId,
                        relation.targetKind,
                        relation.targetKey,
                        relation.path,
                        relation.position
                    );
                }
            }
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
