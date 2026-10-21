/**
 * Display options of the tier list. They were the design-tool settings of the
 * handoff ("Style de card", "Affichage par défaut", "Lueur de fond") and have no
 * on-page control: change them here.
 */

// TYPES
// ##############
export type CardStyle = 'portrait' | 'classic';
export type GroupMode = 'tier' | 'alpha';

export interface DisplayOptions {
    /** Portrait cards (image full-bleed, 3:4) or classic cards (image on top, body below). */
    cardStyle: CardStyle;
    /** Grouping shown on load; the toggle in the filter bar still switches it. */
    defaultGroupMode: GroupMode;
    /** Violet and indigo glow behind the top of the page. */
    ambientGlow: boolean;
}

// CONSTANTS
// ##############
export const DISPLAY_OPTIONS: Readonly<DisplayOptions> = {
    cardStyle: 'portrait',
    defaultGroupMode: 'tier',
    ambientGlow: true,
};
