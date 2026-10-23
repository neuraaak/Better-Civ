import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
        const directory = outputDirectory();
        await expect(
            buildCiv5Database({ fetchJson: fakeFetch, outputDirectory: directory })
        ).resolves.toMatchObject({
            languages: CIV5_LANGUAGES.length,
            families: CIV5_RESOURCE_KINDS.length,
            entities: CIV5_RESOURCE_KINDS.length,
            translations: CIV5_RESOURCE_KINDS.length * CIV5_LANGUAGES.length,
        });
        expect(existsSync(join(directory, 'civilization-5.sqlite'))).toBe(true);
        expect(existsSync(join(directory, 'civilization-5.staging.sqlite'))).toBe(false);
        expect(
            JSON.parse(readFileSync(join(directory, 'civilization-5.manifest.json'), 'utf8'))
        ).toMatchObject({ schema_version: 2 });
    });

    it('preserves prior artifacts when final transformation fails', async () => {
        const directory = outputDirectory();
        const databasePath = join(directory, 'civilization-5.sqlite');
        const manifestPath = join(directory, 'civilization-5.manifest.json');
        writeFileSync(databasePath, 'previous database');
        writeFileSync(manifestPath, 'previous manifest');

        await expect(
            buildCiv5Database({
                outputDirectory: directory,
                fetchJson: async url => {
                    const payload = (await fakeFetch(url)) as { name: string; url: string }[];
                    return payload.map(item => ({ ...item, unexpected_scalar: 1 }));
                },
            })
        ).rejects.toThrow(/unmapped/i);

        expect(readFileSync(databasePath, 'utf8')).toBe('previous database');
        expect(readFileSync(manifestPath, 'utf8')).toBe('previous manifest');
        expect(existsSync(join(directory, 'civilization-5.staging.sqlite'))).toBe(false);
    });
});
