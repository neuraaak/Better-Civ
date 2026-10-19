import { describe, expect, it } from 'vitest';
import { tierBadge } from '@/components/civilisations/tierDesign';

describe('tierBadge', () => {
    it('localizes tier copy for the active application language', () => {
        expect(tierBadge(0, 'en')).toMatchObject({
            rank: 'Legend',
            sub: 'Dominant — viable in every situation',
        });
        expect(tierBadge(0, 'kr')).toMatchObject({
            rank: '전설',
            sub: '압도적 — 어떤 상황에서도 강력합니다',
        });
    });

    it('falls back to English copy for an unsupported language', () => {
        expect(tierBadge(4, 'unknown')).toMatchObject({
            rank: 'Tribe',
            sub: 'Behind the curve — best reserved for challenges',
        });
    });
});
