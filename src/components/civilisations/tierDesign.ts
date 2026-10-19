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

interface TierCopy {
    rank: string;
    sub: string;
}

const PRISM =
    'oklch(0.80 0.14 20), oklch(0.84 0.13 85), oklch(0.80 0.14 155), oklch(0.78 0.13 230), oklch(0.74 0.15 300), oklch(0.80 0.14 20)';

const TIER_COPY: Record<string, TierCopy[]> = {
    fr: [
        { rank: 'Légende', sub: 'Dominantes — viables dans toutes les situations' },
        { rank: 'Empire', sub: 'Très fortes — excellentes dans leur créneau' },
        { rank: 'Royaume', sub: 'Solides — demandent un peu plus de maîtrise' },
        { rank: 'Cité', sub: 'Situationnelles — dépendent de la carte' },
        { rank: 'Tribu', sub: 'En retrait — à réserver aux défis' },
    ],
    en: [
        { rank: 'Legend', sub: 'Dominant — viable in every situation' },
        { rank: 'Empire', sub: 'Very strong — excellent in their niche' },
        { rank: 'Kingdom', sub: 'Solid — require a little more mastery' },
        { rank: 'City', sub: 'Situational — depend on the map' },
        { rank: 'Tribe', sub: 'Behind the curve — best reserved for challenges' },
    ],
    de: [
        { rank: 'Legende', sub: 'Dominant — in jeder Situation spielbar' },
        { rank: 'Imperium', sub: 'Sehr stark — in ihrer Nische hervorragend' },
        { rank: 'Königreich', sub: 'Solide — erfordern etwas mehr Erfahrung' },
        { rank: 'Stadt', sub: 'Situativ — von der Karte abhängig' },
        { rank: 'Stamm', sub: 'Schwächer — besser für Herausforderungen' },
    ],
    es: [
        { rank: 'Leyenda', sub: 'Dominantes — viables en cualquier situación' },
        { rank: 'Imperio', sub: 'Muy fuertes — excelentes en su especialidad' },
        { rank: 'Reino', sub: 'Sólidos — requieren algo más de dominio' },
        { rank: 'Ciudad', sub: 'Situacionales — dependen del mapa' },
        { rank: 'Tribu', sub: 'Rezagadas — mejor para desafíos' },
    ],
    it: [
        { rank: 'Leggenda', sub: 'Dominanti — valide in ogni situazione' },
        { rank: 'Impero', sub: 'Molto forti — eccellenti nella loro nicchia' },
        { rank: 'Regno', sub: 'Solide — richiedono un po’ più di padronanza' },
        { rank: 'Città', sub: 'Situazionali — dipendono dalla mappa' },
        { rank: 'Tribù', sub: 'Meno efficaci — adatte alle sfide' },
    ],
    jp: [
        { rank: '伝説', sub: '支配的 — あらゆる状況で活躍' },
        { rank: '帝国', sub: '非常に強力 — 得意分野で優秀' },
        { rank: '王国', sub: '堅実 — 少し高い習熟が必要' },
        { rank: '都市', sub: '状況次第 — マップに依存' },
        { rank: '部族', sub: '控えめ — 挑戦向け' },
    ],
    kr: [
        { rank: '전설', sub: '압도적 — 어떤 상황에서도 강력합니다' },
        { rank: '제국', sub: '매우 강력함 — 특화 분야에서 뛰어납니다' },
        { rank: '왕국', sub: '탄탄함 — 약간의 숙련이 필요합니다' },
        { rank: '도시', sub: '상황 의존적 — 지도에 따라 달라집니다' },
        { rank: '부족', sub: '다소 약함 — 도전용으로 적합합니다' },
    ],
    pl: [
        { rank: 'Legenda', sub: 'Dominujące — sprawdzają się w każdej sytuacji' },
        { rank: 'Imperium', sub: 'Bardzo silne — świetne w swojej niszy' },
        { rank: 'Królestwo', sub: 'Solidne — wymagają nieco więcej wprawy' },
        { rank: 'Miasto', sub: 'Sytuacyjne — zależne od mapy' },
        { rank: 'Plemię', sub: 'Słabsze — dobre na wyzwania' },
    ],
    ru: [
        { rank: 'Легенда', sub: 'Доминируют — сильны в любой ситуации' },
        { rank: 'Империя', sub: 'Очень сильные — превосходны в своей нише' },
        { rank: 'Королевство', sub: 'Надёжные — требуют чуть больше мастерства' },
        { rank: 'Город', sub: 'Ситуативные — зависят от карты' },
        { rank: 'Племя', sub: 'Слабее — лучше оставить для испытаний' },
    ],
    zh: [
        { rank: '传奇', sub: '统治级 — 适用于任何局面' },
        { rank: '帝国', sub: '非常强大 — 在专长领域表现卓越' },
        { rank: '王国', sub: '扎实 — 需要更多熟练度' },
        { rank: '城邦', sub: '看情况 — 取决于地图' },
        { rank: '部落', sub: '较弱 — 更适合挑战玩法' },
    ],
};

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
export function tierBadge(tierId: number | null | undefined, language = 'fr'): TierBadge {
    const index = TIER_BADGES[tierId ?? -1] ? (tierId ?? -1) : 4;
    const badge = TIER_BADGES[index];
    return { ...badge, ...(TIER_COPY[language] ?? TIER_COPY.en)[index] };
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
