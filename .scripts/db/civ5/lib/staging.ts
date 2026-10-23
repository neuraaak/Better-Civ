import type { DatabaseSync } from 'node:sqlite';
import type { NormalizedResource, StagedResource } from '../types';

export function stageResources(
    database: DatabaseSync,
    resources: readonly NormalizedResource[]
): void {
    const uniqueKeys = new Set<string>();
    for (const resource of resources) {
        const key = `${resource.kind}\u0000${resource.resourceKey}\u0000${resource.language}`;
        if (uniqueKeys.has(key)) {
            throw new Error(
                `Duplicate staged localization for ${resource.kind} ${resource.resourceKey} ${resource.language}`
            );
        }
        uniqueKeys.add(key);
    }
    const insert = database.prepare(
        `INSERT INTO staged_resources
         (kind, resource_key, language, source_url, source_id, name, payload_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    database.exec('BEGIN');
    try {
        for (const resource of resources) {
            insert.run(
                resource.kind,
                resource.resourceKey,
                resource.language,
                resource.sourceUrl,
                resource.sourceId,
                resource.name,
                JSON.stringify(resource.payload)
            );
        }
        database.exec('COMMIT');
    } catch (error) {
        database.exec('ROLLBACK');
        throw error;
    }
}

export function validateStagingCoverage(
    database: DatabaseSync,
    languages: readonly StagedResource['language'][]
): void {
    const rows = database
        .prepare(
            'SELECT kind, resource_key, language FROM staged_resources ORDER BY kind, resource_key, language'
        )
        .all() as { kind: string; resource_key: string; language: string }[];
    const englishKeys = new Set(
        rows.filter(row => row.language === 'en').map(row => `${row.kind}\u0000${row.resource_key}`)
    );

    for (const language of languages) {
        const keys = new Set(
            rows
                .filter(row => row.language === language)
                .map(row => `${row.kind}\u0000${row.resource_key}`)
        );
        for (const key of englishKeys) {
            if (!keys.has(key)) {
                const [kind, resourceKey] = key.split('\u0000');
                throw new Error(
                    `Missing staged localization for ${kind} ${resourceKey} ${language}`
                );
            }
        }
        for (const key of keys) {
            if (!englishKeys.has(key)) {
                const [kind, resourceKey] = key.split('\u0000');
                throw new Error(
                    `Unexpected staged localization for ${kind} ${resourceKey} ${language}`
                );
            }
        }
    }
}

export function readStagedResources(database: DatabaseSync): StagedResource[] {
    return database
        .prepare(
            `SELECT kind, resource_key, language, source_url, source_id, name, payload_json
             FROM staged_resources
             ORDER BY kind, resource_key, language`
        )
        .all()
        .map(row => {
            const record = row as {
                kind: StagedResource['kind'];
                resource_key: string;
                language: StagedResource['language'];
                source_url: string;
                source_id: number | null;
                name: string | null;
                payload_json: string;
            };
            return {
                kind: record.kind,
                resourceKey: record.resource_key,
                language: record.language,
                sourceUrl: record.source_url,
                sourceId: record.source_id,
                name: record.name,
                payload: JSON.parse(record.payload_json),
            };
        });
}
