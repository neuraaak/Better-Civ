import { describe, expect, it } from 'vitest';
import { CIV_RATINGS, withRatings } from '@/data/civRatings';
import { TAG_IDS, TIER_IDS } from '@/data/taxonomy';

describe('civRatings', () => {
    it('rates the 43 civilizations of the game with known tags and tiers', () => {
        expect(CIV_RATINGS.size).toBe(43);
        for (const { tags_id, tier_id } of CIV_RATINGS.values()) {
            expect(TIER_IDS).toContain(tier_id);
            expect(tags_id.length).toBeGreaterThan(0);
            tags_id.forEach(tagId => expect(TAG_IDS).toContain(tagId));
        }
    });

    it('applies the ranking while preserving civilizations absent from it', () => {
        const [inca, spain, unknown] = withRatings([
            { id: 20, name: 'Inca' },
            { id: 21, name: 'Spain' },
            { id: 999, name: 'Mod civ' },
        ]);

        expect(inca).toMatchObject({ tier_id: 0, tags_id: [0] });
        expect(spain).toMatchObject({ tier_id: 2, tags_id: [1] });
        expect(unknown).toEqual({ id: 999, name: 'Mod civ' });
    });
});
