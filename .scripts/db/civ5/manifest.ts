import { createHash } from 'node:crypto';
import { readFile, stat, rename, rm } from 'node:fs/promises';

export interface ArtifactManifest {
    schema_version: number;
    dataset_version: string;
    imported_at: string;
    size_bytes: number;
    sha256: string;
}

export interface ArtifactPaths {
    database: string;
    manifest: string;
}

export async function createManifest(
    databasePath: string,
    schemaVersion: number,
    datasetVersion: string
): Promise<ArtifactManifest> {
    const [contents, details] = await Promise.all([readFile(databasePath), stat(databasePath)]);
    return {
        schema_version: schemaVersion,
        dataset_version: datasetVersion,
        imported_at: new Date().toISOString(),
        size_bytes: details.size,
        sha256: createHash('sha256').update(contents).digest('hex'),
    };
}

export async function replaceArtifactsAtomically(
    staged: ArtifactPaths,
    final: ArtifactPaths
): Promise<void> {
    const suffix = `.backup-${Date.now()}`;
    const backups: ArtifactPaths = {
        database: `${final.database}${suffix}`,
        manifest: `${final.manifest}${suffix}`,
    };
    const moved: (keyof ArtifactPaths)[] = [];
    try {
        for (const key of ['database', 'manifest'] as const) {
            try {
                await rename(final[key], backups[key]);
                moved.push(key);
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
            }
        }
        await rename(staged.database, final.database);
        await rename(staged.manifest, final.manifest);
        await Promise.all(moved.map(key => rm(backups[key], { force: true })));
    } catch (error) {
        await Promise.all(
            moved.map(async key => {
                try {
                    await rename(backups[key], final[key]);
                } catch {
                    /* preserve original failure */
                }
            })
        );
        throw error;
    }
}
