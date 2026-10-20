import { afterEach, describe, expect, it, vi } from 'vitest';
import { civilizationsUrl, fetchCivilizations, parseCivilizations } from '@/api/civApi';

describe('civApi', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('parseCivilizations', () => {
        it('keeps well-formed entries', () => {
            const payload = [{ id: 1, name: 'America', leader: { name: 'Washington' } }];

            expect(parseCivilizations(payload)).toEqual(payload);
        });

        it('drops entries without an integer id or a name', () => {
            const payload = [
                { id: 1, name: 'America' },
                { id: '2', name: 'Arabia' },
                { id: 3 },
                null,
            ];

            expect(parseCivilizations(payload).map(civ => civ.id)).toEqual([1]);
        });

        it.each([{}, 'oops', null])('rejects a non-array payload (%s)', payload => {
            expect(() => parseCivilizations(payload)).toThrow(TypeError);
        });
    });

    describe('fetchCivilizations', () => {
        it('requests the language-specific URL with the abort signal', async () => {
            const fetchMock = vi.fn().mockResolvedValue(new Response('[]'));
            vi.stubGlobal('fetch', fetchMock);
            const controller = new AbortController();

            await expect(fetchCivilizations('kr', controller.signal)).resolves.toEqual([]);
            expect(fetchMock).toHaveBeenCalledWith(civilizationsUrl('kr'), {
                signal: controller.signal,
            });
            expect(civilizationsUrl('kr')).toBe(
                'https://eyefyre.github.io/civvapi/v1/kr/civilizations/civilizations.json'
            );
        });

        it('fails on an HTTP error status', async () => {
            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));

            await expect(fetchCivilizations('fr')).rejects.toThrow('HTTP 503');
        });
    });
});
