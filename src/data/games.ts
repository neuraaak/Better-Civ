/**
 * Civilization games covered by the site. Each one owns a route; only the
 * available ones are ranked, the others show as locked tabs in the header.
 */

// TYPES
// ##############
/** Progress of the ranking work shown on the page of a game that is not out yet. */
export interface Research {
    /** Share of the research that is done, in percent. */
    progress: number;
    /** Turns left before publication, shown in Roman numerals. */
    turns: number;
    /** Index of the running stage in `wipStages` (i18n); earlier stages are done. */
    stage: number;
    /** Card count of each ghost row (S..D) of the blurred preview. */
    ghost: readonly number[];
}

export interface Game {
    /** Roman numeral shown before the name. */
    numeral: string;
    name: string;
    /** Release year, shown on the home card. */
    year: string;
    /** Expansion the ranking assumes, shown under the tier list title. */
    expansion?: string;
    /** Route of the game's tier list. */
    path: string;
    available: boolean;
    /** Only on the games that are not ranked yet. */
    research?: Research;
}

// CONSTANTS
// ##############
export const GAMES: readonly Game[] = [
    {
        numeral: 'V',
        name: 'Civilization V',
        year: '2010',
        expansion: 'Brave New World',
        path: '/civilization-5',
        available: true,
    },
    {
        numeral: 'VI',
        name: 'Civilization VI',
        year: '2016',
        path: '/civilization-6',
        available: false,
        research: { progress: 64, turns: 8, stage: 2, ghost: [3, 6, 7, 5, 3] },
    },
    {
        numeral: 'VII',
        name: 'Civilization VII',
        year: '2025',
        path: '/civilization-7',
        available: false,
        research: { progress: 18, turns: 24, stage: 0, ghost: [2, 4, 6, 4, 2] },
    },
];

/** Game the site opens on. */
export const DEFAULT_GAME_PATH = '/civilization-5';
