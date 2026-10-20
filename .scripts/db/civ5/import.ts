import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CIV5_LANGUAGES, CIV5_RESOURCE_KINDS } from './constants';
import { writeDatabase } from './database';
import { fetchResourceList } from './lib/civvapi-client';
import { assertSameResourceKeys, deduplicateResources, normalizeResource } from './lib/normalize';
import { createFetchJson, type FetchJson } from '../shared/http-client';
import { createManifest, replaceArtifactsAtomically } from './manifest';
import type { ImportSummary, NormalizedResource } from './types';

export interface BuildOptions {
    fetchJson: FetchJson;
    outputDirectory: string;
}

export async function buildCiv5Database(options: BuildOptions): Promise<ImportSummary> {
    const dataset: NormalizedResource[] = [];

    for (const kind of CIV5_RESOURCE_KINDS) {
        const englishDocuments = await fetchResourceList(kind, 'en', options.fetchJson);
        const englishResources = deduplicateResources(
            englishDocuments.map(document => normalizeResource(kind, 'en', document))
        );
        const expectedKeys = englishResources.map(resource => resource.resourceKey);
        dataset.push(...englishResources);

        for (const language of CIV5_LANGUAGES.slice(1)) {
            const documents = await fetchResourceList(kind, language, options.fetchJson);
            const resources = deduplicateResources(
                documents.map(document => normalizeResource(kind, language, document))
            );
            const keys = resources.map(resource => resource.resourceKey);
            assertSameResourceKeys(expectedKeys, keys, kind, language);
            dataset.push(...resources);
        }
    }

    await mkdir(options.outputDirectory, { recursive: true });
    const finalDatabase = join(options.outputDirectory, 'civilization-5.sqlite');
    const finalManifest = join(options.outputDirectory, 'civilization-5.manifest.json');
    const stagedDatabase = `${finalDatabase}.tmp`;
    const stagedManifest = `${finalManifest}.tmp`;
    writeDatabase(stagedDatabase, dataset);
    const manifest = await createManifest(stagedDatabase, 1, 'civvapi-v1');
    await writeFile(stagedManifest, `${JSON.stringify(manifest, null, 2)}\n`);
    await replaceArtifactsAtomically(
        { database: stagedDatabase, manifest: stagedManifest },
        { database: finalDatabase, manifest: finalManifest }
    );

    return {
        families: CIV5_RESOURCE_KINDS.length,
        languages: CIV5_LANGUAGES.length,
        resources: dataset.length,
    };
}

export async function main(): Promise<void> {
    const summary = await buildCiv5Database({
        fetchJson: createFetchJson(),
        outputDirectory: join(process.cwd(), 'bin', 'assets', 'db'),
    });
    console.log(
        `Imported ${summary.resources} localized resources from ${summary.families} families.`
    );
}

if (import.meta.main) {
    main().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}
