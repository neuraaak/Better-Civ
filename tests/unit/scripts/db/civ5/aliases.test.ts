import { describe, expect, it } from 'vitest';
import { resolveRelationTarget } from '../../../../../.scripts/db/civ5/lib/aliases';

describe('resolveRelationTarget', () => {
    const entities = new Set([
        'wonders/alhambra',
        'specialists/khan',
        'promotions/accuracy_i_r',
        'units/b17',
    ]);

    it.each([
        ['buildings/alhambra', 'wonders/alhambra'],
        ['units/khan', 'specialists/khan'],
        ['promotions/accuracy_i', 'promotions/accuracy_i_r'],
        ['units/b17', 'units/b17'],
    ])('resolves %s to %s', (target, expected) => {
        expect(resolveRelationTarget(target, entities)).toBe(expected);
    });

    it('rejects missing and ambiguous targets', () => {
        expect(() => resolveRelationTarget('units/missing', entities)).toThrow(/missing/i);
        expect(() =>
            resolveRelationTarget(
                'buildings/alhambra',
                new Set(['buildings/alhambra', 'wonders/alhambra'])
            )
        ).toThrow(/ambiguous/i);
    });
});
