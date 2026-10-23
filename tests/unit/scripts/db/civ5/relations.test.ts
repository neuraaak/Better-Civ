import { describe, expect, it } from 'vitest';
import { extractResourceRelations } from '../../../../../.scripts/db/civ5/lib/relations';

describe('extractResourceRelations', () => {
    it('keeps nested civvapi resource URLs with their location', () => {
        expect(
            extractResourceRelations({
                unique_units: [{ url: 'https://eyefyre.github.io/civvapi/v1/fr/units/b17.json' }],
            })
        ).toEqual([
            {
                targetKind: 'units',
                targetKey: 'units/b17',
                path: 'unique_units[0].url',
                position: 0,
            },
        ]);
    });
});
