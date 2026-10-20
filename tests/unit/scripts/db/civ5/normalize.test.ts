import { describe, expect, it } from 'vitest';
import { CIV5_LANGUAGES, CIV5_RESOURCE_KINDS } from '../../../../../.scripts/db/civ5/constants';
import {
    assertSameResourceKeys,
    canonicalResourceKey,
    deduplicateResources,
    normalizeResource,
} from '../../../../../.scripts/db/civ5/lib/normalize';

describe('Civ V importer constants', () => {
    it('declares every supported API family and localization', () => {
        expect(CIV5_RESOURCE_KINDS).toHaveLength(16);
        expect(CIV5_LANGUAGES).toEqual([
            'en',
            'de',
            'es',
            'fr',
            'it',
            'jp',
            'kr',
            'pl',
            'ru',
            'zh',
        ]);
    });

    it('rejects incomplete and inconsistent resource data', () => {
        expect(() => normalizeResource('units', 'fr', { name: 'B-17' })).toThrow(/url/i);
        expect(() => canonicalResourceKey('https://example.test/v1/fr/units/b17.json')).toThrow(
            /civvapi/i
        );
        expect(() => assertSameResourceKeys(['units/b17'], [], 'units', 'fr')).toThrow(/missing/i);
    });

    it('keeps the first source document for duplicate canonical keys', () => {
        expect(
            deduplicateResources([
                { resourceKey: 'policies/universal_healthcare', id: 85 },
                { resourceKey: 'policies/universal_healthcare', id: 86 },
            ])
        ).toEqual([{ resourceKey: 'policies/universal_healthcare', id: 85 }]);
    });

    it('keeps nested resource paths in canonical keys', () => {
        expect(
            canonicalResourceKey(
                'https://eyefyre.github.io/civvapi/v1/en/promotions/bonus_vs_aircraft/helicopters_(150)_at.json'
            )
        ).toBe('promotions/bonus_vs_aircraft/helicopters_(150)_at');
    });

    it('uses the stable wonder id when civvapi omits its resource URL', () => {
        expect(normalizeResource('wonders', 'fr', { id: 48, name: 'Cirque Maxime' })).toMatchObject(
            {
                resourceKey: 'wonders/id-48',
                sourceUrl: 'https://eyefyre.github.io/civvapi/v1/fr/wonders/id-48.json',
            }
        );
    });
});
