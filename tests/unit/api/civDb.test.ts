import { afterEach, describe, expect, it, vi } from 'vitest';
import { assetUrl, loadDatabase, localIconUrl, parseManifest, resetDatabase } from '@/api/civDb';

const R2 = 'https://repository.neuraaak.fr/better-civ/civilization-5';

// The real WASM binary cannot load under jsdom, and these tests never query.
vi.mock('sql.js/dist/sql-wasm.wasm?url', () => ({ default: 'sql-wasm.wasm' }));
vi.mock('sql.js', () => ({
    default: () => Promise.resolve({ Database: class {} }),
}));

describe('civDb', () => {
    afterEach(() => {
        resetDatabase();
        vi.unstubAllGlobals();
    });

    describe('assetUrl', () => {
        it('mirrors an upstream png onto the R2 webp tree', () => {
            expect(assetUrl('https://eyefyre.github.io/civvapi/images/civ_icons/babylon.png')).toBe(
                `${R2}/images/civ_icons/babylon.webp`
            );
        });

        it('keeps a foreign URL untouched and maps a missing icon to an empty string', () => {
            expect(assetUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
            expect(assetUrl(null)).toBe('');
        });
    });

    describe('localIconUrl', () => {
        it('supplies the icon of the two unique units CivVAPI files as specialists', () => {
            expect(localIconUrl('specialists/khan')).toBe(`${R2}/images/unit_icons/khan.webp`);
            expect(localIconUrl('specialists/merchant_of_venice')).toBe(
                `${R2}/images/unit_icons/merchant_of_venice.webp`
            );
        });

        it('leaves any other entity without an icon rather than guessing one', () => {
            expect(localIconUrl('units/samurai')).toBe('');
            expect(localIconUrl('specialists/engineer')).toBe('');
            expect(localIconUrl(undefined)).toBe('');
        });
    });

    describe('parseManifest', () => {
        it('accepts the published manifest', () => {
            const manifest = { schema_version: 2, size_bytes: 12812288, sha256: 'c2f0' };

            expect(parseManifest(manifest)).toBe(manifest);
        });

        it.each([
            { schema_version: 1, size_bytes: 1, sha256: 'a' },
            { schema_version: 2, size_bytes: 1.5, sha256: 'a' },
            { schema_version: 2, size_bytes: 1 },
            null,
        ])('rejects an unusable manifest (%s)', payload => {
            expect(() => parseManifest(payload)).toThrow(TypeError);
        });
    });

    describe('loadDatabase', () => {
        it('fails on a manifest HTTP error and does not cache the failure', async () => {
            const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
            vi.stubGlobal('fetch', fetchMock);

            await expect(loadDatabase()).rejects.toThrow('HTTP 503');
            await expect(loadDatabase()).rejects.toThrow('HTTP 503');
            expect(fetchMock).toHaveBeenCalledTimes(2);
        });

        it('rejects a database whose size contradicts the manifest', async () => {
            vi.stubGlobal(
                'fetch',
                vi.fn(async (url: string) =>
                    url.endsWith('.manifest.json')
                        ? Response.json({ schema_version: 2, size_bytes: 99, sha256: 'a' })
                        : new Response(new Uint8Array(4))
                )
            );

            await expect(loadDatabase()).rejects.toThrow('size mismatch');
        });
    });
});
