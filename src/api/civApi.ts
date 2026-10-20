/**
 * Client for the civvapi civilization list (https://github.com/eyefyre/civvapi).
 * The payload is validated here so the rest of the app can trust its shape.
 */
import type { Lang } from '../i18n/languages';

// TYPES
// ##############
export interface HistoricalInfoDto {
    heading?: string;
    text?: string;
}

/** Unique units and buildings come either as plain names or as objects. */
export type UniqueItemDto = string | { name?: string; icon?: string };

export interface LeaderDto {
    name?: string;
    icon?: string;
    subtitle?: string;
    trait?: { name?: string; effect?: string };
    historical_info?: HistoricalInfoDto[];
}

export interface CivApiDto {
    id: number;
    /** May carry singular|plural forms ("Inca|Incas"). */
    name: string;
    icon?: string;
    leader?: LeaderDto;
    historical_info?: HistoricalInfoDto[];
    unique_units?: UniqueItemDto[];
    unique_buildings?: UniqueItemDto[];
}

// FUNCTIONS
// ##############
export function civilizationsUrl(lang: Lang): string {
    return `https://eyefyre.github.io/civvapi/v1/${lang}/civilizations/civilizations.json`;
}

function isCivApiDto(value: unknown): value is CivApiDto {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return Number.isInteger(candidate.id) && typeof candidate.name === 'string';
}

/** Rejects a non-array payload and drops entries without a numeric id and a name. */
export function parseCivilizations(payload: unknown): CivApiDto[] {
    if (!Array.isArray(payload)) {
        throw new TypeError('Invalid civilizations payload: expected an array');
    }
    return payload.filter(isCivApiDto);
}

export async function fetchCivilizations(lang: Lang, signal?: AbortSignal): Promise<CivApiDto[]> {
    const response = await fetch(civilizationsUrl(lang), { signal });
    if (!response.ok) throw new Error(`civvapi responded with HTTP ${response.status}`);
    return parseCivilizations(await response.json());
}
