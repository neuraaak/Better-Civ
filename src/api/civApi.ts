/**
 * Shape of the Civ V civilization payload, as published by civvapi
 * (https://github.com/eyefyre/civvapi) and mirrored by the SQLite artifact
 * `civDb.ts` reads. The rest of the app depends on this shape, not its source.
 */

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
