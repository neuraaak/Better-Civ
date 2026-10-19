/**
 * Visual vocabulary shared by the tier list (handoff "Tier List Civilisations v2"):
 * tier badges, tier section copy and category colours. Indexes follow the store:
 * tier_id 0..4 → S..D, tag_id 0..6 → Polyvalent..Production.
 */

// CONSTANTS
// ##############
export interface TierBadge {
    key: string;
    letter: string;
    rank: string;
    sub: string;
    shape: string;
    faceShape: string;
    inset: string;
    nudge: string;
    rim: string;
    face: string;
    fg: string;
    glow: string;
    anim: string;
    label: string;
    frame: string;
    line: string;
}

const PRISM =
    'oklch(0.80 0.14 20), oklch(0.84 0.13 85), oklch(0.80 0.14 155), oklch(0.78 0.13 230), oklch(0.74 0.15 300), oklch(0.80 0.14 20)';

/** n-pointed star clip-path whose inner vertices sit at `inner` × the outer radius. */
export function star(points: number, inner: number): string {
    const vertices = Array.from({ length: points * 2 }, (_, i) => {
        const radius = i % 2 ? inner : 1;
        const angle = (Math.PI * i) / points - Math.PI / 2;
        const x = (50 + 50 * radius * Math.cos(angle)).toFixed(1);
        const y = (50 + 50 * radius * Math.sin(angle)).toFixed(1);
        return `${x}% ${y}%`;
    });
    return `polygon(${vertices.join(',')})`;
}

export const TIER_BADGES: TierBadge[] = [
    {
        key: 's',
        letter: 'S',
        rank: 'Légende',
        sub: 'Dominantes — viables dans toutes les situations',
        shape: star(16, 0.84),
        faceShape: 'circle(50%)',
        inset: '16%',
        nudge: '0',
        rim: `conic-gradient(from 0deg, ${PRISM})`,
        face: 'radial-gradient(circle at 50% 30%, oklch(1 0 0 / 0.22), transparent 55%), conic-gradient(from 200deg, oklch(0.40 0.10 20), oklch(0.40 0.10 140), oklch(0.36 0.11 270), oklch(0.40 0.10 20))',
        fg: 'oklch(0.98 0.01 90)',
        glow: 'drop-shadow(0 0 6px oklch(0.78 0.14 300 / 0.55)) drop-shadow(0 0 12px oklch(0.82 0.13 85 / 0.30))',
        anim: 'dc-spin 14s linear infinite',
        label: 'oklch(0.86 0.10 85)',
        frame: 'color-mix(in srgb, oklch(0.80 0.12 300) 45%, transparent)',
        line: `linear-gradient(90deg, ${PRISM})`,
    },
    {
        key: 'a',
        letter: 'A',
        rank: 'Empire',
        sub: 'Très fortes — excellentes dans leur créneau',
        shape: star(8, 0.8),
        faceShape: 'circle(50%)',
        inset: '17%',
        nudge: '0',
        rim: 'linear-gradient(150deg, var(--color-accent-200), var(--color-accent-500) 50%, var(--color-accent-800))',
        face: 'radial-gradient(circle at 40% 28%, var(--color-accent-600), var(--color-accent-900))',
        fg: 'var(--color-accent-100)',
        glow: 'drop-shadow(0 0 8px color-mix(in srgb, var(--color-accent) 60%, transparent))',
        anim: 'none',
        label: 'var(--color-accent-300)',
        frame: 'color-mix(in srgb, var(--color-accent) 40%, transparent)',
        line: 'var(--color-accent)',
    },
    {
        key: 'b',
        letter: 'B',
        rank: 'Royaume',
        sub: 'Solides — demandent un peu plus de maîtrise',
        shape: 'polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0 50%)',
        faceShape: 'polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0 50%)',
        inset: '11%',
        nudge: '0',
        rim: 'linear-gradient(150deg, oklch(0.95 0.09 95), oklch(0.78 0.13 82) 45%, oklch(0.52 0.10 65))',
        face: 'radial-gradient(circle at 40% 28%, oklch(0.50 0.09 75), oklch(0.27 0.05 60))',
        fg: 'oklch(0.96 0.06 95)',
        glow: 'drop-shadow(0 0 6px oklch(0.80 0.13 85 / 0.40))',
        anim: 'none',
        label: 'oklch(0.84 0.11 88)',
        frame: 'color-mix(in srgb, oklch(0.80 0.13 85) 28%, transparent)',
        line: 'oklch(0.80 0.13 85)',
    },
    {
        key: 'c',
        letter: 'C',
        rank: 'Cité',
        sub: 'Situationnelles — dépendent de la carte',
        shape: 'polygon(50% 0,100% 13%,100% 58%,50% 100%,0 58%,0 13%)',
        faceShape: 'polygon(50% 0,100% 13%,100% 58%,50% 100%,0 58%,0 13%)',
        inset: '10%',
        nudge: '10%',
        rim: 'linear-gradient(160deg, oklch(0.95 0.01 260), oklch(0.70 0.015 260) 50%, oklch(0.48 0.015 260))',
        face: 'linear-gradient(165deg, oklch(0.50 0.015 260), oklch(0.28 0.015 260))',
        fg: 'oklch(0.97 0.005 260)',
        glow: 'drop-shadow(0 0 4px oklch(0.85 0.01 260 / 0.25))',
        anim: 'none',
        label: 'oklch(0.82 0.01 260)',
        frame: 'color-mix(in srgb, oklch(0.85 0.01 260) 18%, transparent)',
        line: 'oklch(0.85 0.01 260)',
    },
    {
        key: 'd',
        letter: 'D',
        rank: 'Tribu',
        sub: 'En retrait — à réserver aux défis',
        shape: 'circle(50%)',
        faceShape: 'circle(50%)',
        inset: '11%',
        nudge: '0',
        rim: 'linear-gradient(150deg, oklch(0.76 0.08 62), oklch(0.50 0.08 45) 60%, oklch(0.40 0.06 40))',
        face: 'radial-gradient(circle at 35% 28%, oklch(0.54 0.08 52), oklch(0.30 0.05 40))',
        fg: 'oklch(0.93 0.04 70)',
        glow: 'none',
        anim: 'none',
        label: 'oklch(0.72 0.08 60)',
        frame: 'color-mix(in srgb, oklch(0.62 0.08 50) 22%, transparent)',
        line: 'oklch(0.62 0.08 50)',
    },
];

export const CATEGORY_COLORS = [
    'oklch(0.76 0.03 260)', // Polyvalent
    'oklch(0.74 0.11 310)', // Culture
    'oklch(0.80 0.10 85)', // Foi
    'oklch(0.74 0.10 230)', // Science
    'oklch(0.70 0.13 25)', // Militaire
    'oklch(0.74 0.11 155)', // Commerce
    'oklch(0.74 0.11 55)', // Production
];

// FUNCTIONS
// ##############
/** Badge for a tier id, falling back to tier D for unknown ids. */
export function tierBadge(tierId: number | null | undefined): TierBadge {
    return TIER_BADGES[tierId ?? -1] ?? TIER_BADGES[4];
}

export function categoryColor(tagId: number | null | undefined): string {
    return CATEGORY_COLORS[tagId ?? -1] ?? 'var(--color-neutral-600)';
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
