/**
 * Languages offered by the selector. Codes match the civvapi URL segments,
 * which is why Japanese and Korean use `jp` / `kr`; `htmlLang` is the BCP 47 tag.
 */
export const LANGUAGES = [
    { code: 'en', htmlLang: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'de', htmlLang: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'es', htmlLang: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'fr', htmlLang: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'it', htmlLang: 'it', label: 'IT', flag: '🇮🇹' },
    { code: 'jp', htmlLang: 'ja', label: 'JP', flag: '🇯🇵' },
    { code: 'kr', htmlLang: 'ko', label: 'KR', flag: '🇰🇷' },
    { code: 'pl', htmlLang: 'pl', label: 'PL', flag: '🇵🇱' },
    { code: 'ru', htmlLang: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'zh', htmlLang: 'zh', label: 'ZH', flag: '🇨🇳' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANG: Lang = 'fr';

export function isLang(value: string): value is Lang {
    return LANGUAGES.some(language => language.code === value);
}

export function htmlLang(lang: Lang): string {
    return LANGUAGES.find(language => language.code === lang)?.htmlLang ?? lang;
}
