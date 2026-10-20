/**
 * Languages offered by the selector. Codes match the civvapi URL segments,
 * which is why Japanese and Korean use `jp` / `kr` rather than ISO codes.
 */
export const LANGUAGES = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'it', label: 'IT', flag: '🇮🇹' },
    { code: 'jp', label: 'JP', flag: '🇯🇵' },
    { code: 'kr', label: 'KR', flag: '🇰🇷' },
    { code: 'pl', label: 'PL', flag: '🇵🇱' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANG: Lang = 'fr';

export function isLang(value: string): value is Lang {
    return LANGUAGES.some(language => language.code === value);
}
