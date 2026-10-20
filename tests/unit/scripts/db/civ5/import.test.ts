import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { CIV5_LANGUAGES, CIV5_RESOURCE_KINDS } from '../../../../../.scripts/db/civ5/constants';
import { buildCiv5Database } from '../../../../../.scripts/db/civ5/import';

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true })));

function outputDirectory(): string {
    const directory = mkdtempSync(join(tmpdir(), 'better-civ-import-'));
    directories.push(directory);
    return directory;
}

function fakeFetch(url: string): Promise<unknown> {
    const [, language, kind] = url.match(/v1\/([^/]+)\/([^/]+)/) ?? [];
    return Promise.resolve([
        {
            name: `${language}-${kind}`,
            url: `https://eyefyre.github.io/civvapi/v1/${language}/${kind}/sample.json`,
        },
    ]);
}

describe('buildCiv5Database', () => {
    it('imports every language and family with matching resource keys', async () => {
        await expect(
            buildCiv5Database({ fetchJson: fakeFetch, outputDirectory: outputDirectory() })
        ).resolves.toMatchObject({
            languages: CIV5_LANGUAGES.length,
            families: CIV5_RESOURCE_KINDS.length,
        });
    });
});
