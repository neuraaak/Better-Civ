/**
 * Ids of the ranking taxonomy. Labels live in i18n/messages.ts and visuals in
 * components/civilisations/tierDesign.ts, both indexed by these ids.
 */

// Polyvalent, Culture, Faith, Science, Military, Trade, Production
export const TAG_IDS = [0, 1, 2, 3, 4, 5, 6] as const;
export type TagId = (typeof TAG_IDS)[number];

// S, A, B, C, D
export const TIER_IDS = [0, 1, 2, 3, 4] as const;
export type TierId = (typeof TIER_IDS)[number];
