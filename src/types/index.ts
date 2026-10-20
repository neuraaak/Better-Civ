import type { CivApiDto } from '../api/civApi';
import type { TagId, TierId } from '../data/taxonomy';

/** API civilization enriched with its ranking; unrated civilizations have neither field. */
export interface Civilization extends CivApiDto {
    tags_id?: TagId[];
    tier_id?: TierId;
}
