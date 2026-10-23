/**
 * Visual vocabulary shared by the tier list (handoff "Better-Civ"): tier coins,
 * category colours, category icons and yield chips. Indexes follow data/taxonomy.ts:
 * tier_id 0..4 → S..D, tag_id 0..6 → Polyvalent..Production. Tier copy comes from i18n.
 */

import { DEFAULT_LANG, type Lang } from '../../i18n/languages';
import { messages } from '../../i18n/messages';
import type { PhosphorIconName } from '../icons/phosphorIcons';

// TYPES
// ##############
/** Ornament struck into the coin's outer band; `none` leaves it plain. */
type CoinOrnament = 'none' | 'ring' | 'beads' | 'key';

interface TierVisual {
    key: string;
    letter: string;
    /** Outer disc of the coin. */
    rim: string;
    /** Struck face, inset inside the rim. */
    face: string;
    /** Colour of the letter. */
    fg: string;
    /** Colour of the ornament band. */
    orn: string;
    ornament: CoinOrnament;
    /** Laurel wreath around the coin, for the legend tier only. */
    laurel: boolean;
    /** Colour of the laurel leaves. */
    leaf: string;
    glow: string;
    /** Animation of the ornament band. */
    anim: string;
    label: string;
    frame: string;
    line: string;
}

/** Tier visuals merged with the tier copy of the current language. */
export interface TierBadge extends TierVisual {
    rank: string;
    sub: string;
}

// CONSTANTS
// ##############
/**
 * Laurel wreath of the legend coin: two symmetric arcs of sixteen leaves,
 * placed on a -50 -50 100 100 viewBox, alternating inner and outer radius.
 */
function laurelLeaves(): string[] {
    const leaves: string[] = [];
    for (const side of [1, -1]) {
        for (let index = 0; index < 16; index++) {
            const theta = 100 + Math.floor(index / 2) * 18;
            const radius = 43 + (index % 2 ? 3 : -3);
            const degrees = side === 1 ? theta : 180 - theta;
            const radians = (degrees * Math.PI) / 180;
            const x = (radius * Math.cos(radians)).toFixed(1);
            const y = (radius * Math.sin(radians)).toFixed(1);
            const tilt = (degrees + 90 * side + (index % 2 ? 28 : -28) * side).toFixed(0);
            leaves.push(`translate(${x} ${y}) rotate(${tilt})`);
        }
    }
    return leaves;
}

export const LAUREL_LEAVES: readonly string[] = laurelLeaves();

/** Every tier is the same coin; only its metal, ornament and glow differ. */
const COIN: Pick<TierVisual, 'ornament' | 'laurel' | 'leaf' | 'anim'> = {
    ornament: 'none',
    laurel: false,
    leaf: 'transparent',
    anim: 'none',
};

export const TIER_BADGES: readonly TierVisual[] = [
    {
        ...COIN,
        key: 's',
        letter: 'S',
        ornament: 'key',
        laurel: true,
        leaf: 'oklch(0.84 0.10 85)',
        anim: 'dc-spin 30s linear infinite',
        rim: 'linear-gradient(150deg, oklch(0.78 0.12 22), oklch(0.56 0.19 24) 45%, oklch(0.34 0.12 22))',
        face: 'radial-gradient(circle at 40% 30%, oklch(0.50 0.17 24), oklch(0.24 0.08 22))',
        fg: 'oklch(0.95 0.06 95)',
        orn: 'oklch(0.90 0.09 90)',
        glow: 'drop-shadow(0 0 10px oklch(0.60 0.19 24 / 0.6)) drop-shadow(0 0 18px oklch(0.84 0.10 85 / 0.22))',
        label: 'oklch(0.74 0.15 24)',
        frame: 'color-mix(in srgb, oklch(0.60 0.19 24) 45%, transparent)',
        line: 'linear-gradient(90deg, oklch(0.60 0.19 24), oklch(0.84 0.10 85), oklch(0.60 0.19 24))',
    },
    {
        ...COIN,
        key: 'a',
        letter: 'A',
        ornament: 'key',
        rim: 'linear-gradient(150deg, var(--color-accent-200), var(--color-accent-500) 50%, var(--color-accent-800))',
        face: 'radial-gradient(circle at 40% 30%, var(--color-accent-600), var(--color-accent-900))',
        fg: 'var(--color-accent-100)',
        orn: 'var(--color-accent-100)',
        glow: 'drop-shadow(0 0 8px color-mix(in srgb, var(--color-accent) 50%, transparent))',
        label: 'var(--color-accent-300)',
        frame: 'color-mix(in srgb, var(--color-accent) 40%, transparent)',
        line: 'var(--color-accent)',
    },
    {
        ...COIN,
        key: 'b',
        letter: 'B',
        ornament: 'beads',
        rim: 'linear-gradient(150deg, oklch(0.92 0.08 95), oklch(0.76 0.11 82) 50%, oklch(0.48 0.09 65))',
        face: 'radial-gradient(circle at 40% 30%, oklch(0.52 0.08 75), oklch(0.28 0.05 60))',
        fg: 'oklch(0.95 0.06 95)',
        orn: 'oklch(0.93 0.08 95)',
        glow: 'drop-shadow(0 0 5px oklch(0.80 0.11 85 / 0.30))',
        label: 'oklch(0.84 0.10 88)',
        frame: 'color-mix(in srgb, oklch(0.80 0.11 85) 26%, transparent)',
        line: 'oklch(0.80 0.11 85)',
    },
    {
        ...COIN,
        key: 'c',
        letter: 'C',
        ornament: 'ring',
        rim: 'linear-gradient(150deg, var(--color-neutral-100), var(--color-neutral-400) 55%, var(--color-neutral-700))',
        face: 'radial-gradient(circle at 40% 30%, var(--color-neutral-600), var(--color-neutral-900))',
        fg: 'var(--color-neutral-100)',
        orn: 'var(--color-neutral-200)',
        glow: 'none',
        label: 'var(--color-neutral-200)',
        frame: 'color-mix(in srgb, var(--color-neutral-300) 20%, transparent)',
        line: 'var(--color-neutral-300)',
    },
    {
        ...COIN,
        key: 'd',
        letter: 'D',
        rim: 'linear-gradient(150deg, oklch(0.74 0.07 60), oklch(0.52 0.07 48) 55%, oklch(0.36 0.05 40))',
        face: 'radial-gradient(circle at 40% 30%, oklch(0.50 0.06 50), oklch(0.28 0.04 40))',
        fg: 'oklch(0.90 0.04 70)',
        orn: 'oklch(0.80 0.06 65)',
        glow: 'none',
        label: 'oklch(0.72 0.07 60)',
        frame: 'color-mix(in srgb, oklch(0.62 0.07 50) 24%, transparent)',
        line: 'oklch(0.62 0.07 50)',
    },
];

export const CATEGORY_COLORS: readonly string[] = [
    'oklch(0.76 0.03 260)', // Polyvalent
    'oklch(0.74 0.11 310)', // Culture
    'oklch(0.80 0.10 85)', // Foi
    'oklch(0.74 0.10 230)', // Science
    'oklch(0.70 0.13 25)', // Militaire
    'oklch(0.74 0.11 155)', // Commerce
    'oklch(0.74 0.11 55)', // Production
];

export const CATEGORY_ICONS: readonly PhosphorIconName[] = [
    'compass', // Polyvalent
    'mask-happy', // Culture
    'hands-praying', // Foi
    'flask', // Science
    'sword', // Militaire
    'coins', // Commerce
    'hammer', // Production
];

/**
 * Yield chips of the detail panel, keyed by the `entity_yields.yield_type`
 * vocabulary of the database. Culture, faith, science and production share the
 * colour of the matching civilization category.
 */
export const YIELD_VISUALS: Readonly<Record<string, { icon: PhosphorIconName; color: string }>> = {
    food: { icon: 'grains', color: 'oklch(0.80 0.12 120)' },
    production: { icon: 'hammer', color: categoryColor(6) },
    gold: { icon: 'coins', color: 'oklch(0.84 0.12 88)' },
    science: { icon: 'flask', color: categoryColor(3) },
    culture: { icon: 'mask-happy', color: categoryColor(1) },
    faith: { icon: 'hands-praying', color: 'oklch(0.86 0.06 85)' },
    happiness: { icon: 'smiley', color: 'oklch(0.84 0.09 75)' },
};

// FUNCTIONS
// ##############
/** Badge for a tier id, falling back to tier D for unknown ids. */
export function tierBadge(tierId: number | null | undefined, lang: Lang = DEFAULT_LANG): TierBadge {
    const index = tierId != null && TIER_BADGES[tierId] ? tierId : TIER_BADGES.length - 1;
    const { rank, sub } = messages(lang).tiers[index];
    return { ...TIER_BADGES[index], rank, sub };
}

export function categoryColor(tagId: number | null | undefined): string {
    return CATEGORY_COLORS[tagId ?? -1] ?? 'var(--color-neutral-600)';
}

export function categoryIcon(tagId: number): PhosphorIconName {
    return CATEGORY_ICONS[tagId] ?? 'compass';
}

export function toRoman(value: number): string {
    const numerals: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];
    let rest = value;
    return numerals.reduce((result, [number, numeral]) => {
        while (rest >= number) {
            result += numeral;
            rest -= number;
        }
        return result;
    }, '');
}
