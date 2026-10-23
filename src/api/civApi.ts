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

/** A yield of a building or an improvement, in the yield vocabulary of the database. */
export interface YieldDto {
    type: string;
    amount: number;
}

/**
 * Unique units, buildings and improvements come either as plain names or as
 * objects. Everything past `name` and `icon` is optional: the panel shows the
 * rows the database happens to carry and leaves the others out.
 */
export type UniqueItemDto =
    | string
    | {
          name?: string;
          icon?: string;
          /** In-game description (`game_info`). */
          description?: string;
          /** In-game advice (`strategy`). */
          strategy?: string;
          /** Technology that unlocks the item. */
          tech?: string;
          /** Production cost. */
          cost?: number;
          /** Movement points — units only. */
          movement?: number;
          /** Gold maintenance per turn — buildings only. */
          upkeep?: number;
          yields?: YieldDto[];
          /** Terrains and features it can be built on — improvements only. */
          terrains?: string[];
      };

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
    unique_improvements?: UniqueItemDto[];
}
