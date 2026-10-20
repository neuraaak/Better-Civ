import type { CivApiDto } from '../api/civApi';
import type { Civilization } from '../types';
import type { TagId, TierId } from './taxonomy';

// TYPES
// ##############
interface CivRating {
    tags_id: TagId[];
    tier_id: TierId;
}

// CONSTANTS
// ##############
/** Ranking of each civilization, keyed by civvapi id. */
export const CIV_RATINGS: ReadonlyMap<number, CivRating> = new Map([
    [1, { tags_id: [5, 6], tier_id: 3 }], // America
    [2, { tags_id: [5, 2], tier_id: 1 }], // Arabia
    [3, { tags_id: [6, 1], tier_id: 1 }], // Aztecs
    [4, { tags_id: [6], tier_id: 2 }], // China
    [5, { tags_id: [4], tier_id: 1 }], // Egypt
    [6, { tags_id: [6], tier_id: 1 }], // England
    [7, { tags_id: [1], tier_id: 4 }], // France
    [8, { tags_id: [6, 5], tier_id: 3 }], // Germany
    [9, { tags_id: [0], tier_id: 2 }], // Greece
    [10, { tags_id: [0], tier_id: 2 }], // India
    [11, { tags_id: [0], tier_id: 4 }], // Iroquois
    [12, { tags_id: [6, 1], tier_id: 4 }], // Japan
    [13, { tags_id: [6], tier_id: 4 }], // Ottomans
    [14, { tags_id: [0], tier_id: 1 }], // Persia
    [15, { tags_id: [4], tier_id: 2 }], // Rome
    [16, { tags_id: [4], tier_id: 2 }], // Russia
    [17, { tags_id: [0], tier_id: 2 }], // Siam
    [18, { tags_id: [6], tier_id: 3 }], // Songhai
    [19, { tags_id: [6], tier_id: 3 }], // Mongolia
    [20, { tags_id: [0], tier_id: 0 }], // Incas
    [21, { tags_id: [1], tier_id: 2 }], // Spain
    [22, { tags_id: [6], tier_id: 3 }], // Polynesia
    [23, { tags_id: [6], tier_id: 3 }], // Denmark
    [24, { tags_id: [3], tier_id: 0 }], // Korea
    [25, { tags_id: [3], tier_id: 0 }], // Babylon
    [26, { tags_id: [0], tier_id: 2 }], // Austria
    [27, { tags_id: [2], tier_id: 4 }], // Byzantium
    [28, { tags_id: [0], tier_id: 3 }], // Carthage
    [29, { tags_id: [2], tier_id: 2 }], // Celts
    [30, { tags_id: [6], tier_id: 1 }], // Ethiopia
    [31, { tags_id: [6, 4], tier_id: 1 }], // Huns
    [32, { tags_id: [0], tier_id: 1 }], // Mayans
    [33, { tags_id: [0], tier_id: 3 }], // Netherlands
    [34, { tags_id: [0], tier_id: 3 }], // Sweden
    [35, { tags_id: [3], tier_id: 4 }], // Assyria
    [36, { tags_id: [1], tier_id: 4 }], // Brazil
    [37, { tags_id: [0], tier_id: 3 }], // Indonesia
    [38, { tags_id: [5, 1], tier_id: 3 }], // Morocco
    [39, { tags_id: [0], tier_id: 0 }], // Poland
    [40, { tags_id: [5], tier_id: 3 }], // Portugal
    [41, { tags_id: [0], tier_id: 1 }], // Shoshone
    [42, { tags_id: [5], tier_id: 4 }], // Venice
    [43, { tags_id: [6], tier_id: 2 }], // Zulus
]);

// FUNCTIONS
// ##############
/** Attaches tier and tags to API civilizations; unrated ones are kept as-is. */
export function withRatings(civilizations: CivApiDto[]): Civilization[] {
    return civilizations.map(civ => {
        const rating = CIV_RATINGS.get(civ.id);
        return rating ? { ...civ, ...rating } : { ...civ };
    });
}
