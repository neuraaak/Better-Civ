import { describe, expect, it } from 'vitest';
import { TAG_IDS, TIER_IDS } from '@/data/taxonomy';
import { isLang, LANGUAGES } from '@/i18n/languages';
import { MESSAGES } from '@/i18n/messages';

describe('i18n', () => {
    const uiKeys = Object.keys(MESSAGES.fr.ui).sort();

    it.each(LANGUAGES.map(language => language.code))('has complete messages for %s', lang => {
        const messages = MESSAGES[lang];

        expect(Object.keys(messages.ui).sort()).toEqual(uiKeys);
        Object.values(messages.ui).forEach(text => expect(text.trim()).not.toBe(''));
        expect(messages.tags).toHaveLength(TAG_IDS.length);
        expect(messages.tiers).toHaveLength(TIER_IDS.length);
        messages.tiers.forEach(tier => {
            expect(tier.label && tier.rank && tier.sub).toBeTruthy();
        });
    });

    it('recognizes supported language codes only', () => {
        expect(isLang('jp')).toBe(true);
        expect(isLang('ja')).toBe(false);
    });
});
