/**
 * Civilization games covered by the site. Each one owns a route; only the
 * available ones are ranked, the others show as locked tabs in the header.
 */

// TYPES
// ##############
export interface Game {
    /** Roman numeral shown before the name. */
    numeral: string;
    name: string;
    /** Route of the game's tier list. */
    path: string;
    available: boolean;
}

// CONSTANTS
// ##############
export const GAMES: readonly Game[] = [
    { numeral: 'V', name: 'Civilization V', path: '/civilization-5', available: true },
    { numeral: 'VI', name: 'Civilization VI', path: '/civilization-6', available: false },
    { numeral: 'VII', name: 'Civilization VII', path: '/civilization-7', available: false },
];

/** Game the site opens on. */
export const DEFAULT_GAME_PATH = '/civilization-5';
