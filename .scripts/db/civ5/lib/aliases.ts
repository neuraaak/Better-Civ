// CivVAPI files some entities under a family that differs from the one its relation URLs use.
const CIV5_RELATION_ALIASES_V1: Readonly<Record<string, string>> = {
    'units/khan': 'specialists/khan',
    'units/merchant_of_venice': 'specialists/merchant_of_venice',
};

// Promotions are published under a key suffixed with their category, which relation URLs omit.
const CIV5_PROMOTION_SUFFIXES_V1 = ['r', 'm', 'n', 'a', 'at', 'h', 's'];

// Referenced by other entities, but never published by CivVAPI: these relations are dropped.
const CIV5_DANGLING_TARGETS_V1 = new Set([
    'buildings/circus_maximus',
    'buildings/east_india_company',
    'buildings/grand_temple',
    'buildings/hermitage',
    'buildings/heroic_epic',
    'buildings/ironworks',
    'buildings/national_college',
    'buildings/national_epic',
    'buildings/national_intelligence_agency',
    'buildings/national_visitor_center',
    'buildings/oxford_university',
    'promotions/bonus_vs_aircraft_helicopters_(150)_at',
    'promotions/bonus_vs_armored_(25)',
    'promotions/bonus_vs_bombers_helicopters_(150)_at',
    'promotions/combat_bonus_in_forest_jungle_(33)_at',
]);

export function resolveRelationTarget(
    targetKey: string,
    entityCodes: ReadonlySet<string>
): string | null {
    const candidates = new Set<string>();
    if (entityCodes.has(targetKey)) candidates.add(targetKey);
    const alias = CIV5_RELATION_ALIASES_V1[targetKey];
    if (alias && entityCodes.has(alias)) candidates.add(alias);
    // World wonders are linked as buildings by the techs that unlock them.
    if (targetKey.startsWith('buildings/')) {
        const wonder = targetKey.replace('buildings/', 'wonders/');
        if (entityCodes.has(wonder)) candidates.add(wonder);
    }
    if (targetKey.startsWith('promotions/'))
        for (const suffix of CIV5_PROMOTION_SUFFIXES_V1) {
            const suffixed = `${targetKey}_${suffix}`;
            if (entityCodes.has(suffixed)) candidates.add(suffixed);
        }

    if (candidates.size === 1) return [...candidates][0];
    if (candidates.size === 0) {
        if (CIV5_DANGLING_TARGETS_V1.has(targetKey)) return null;
        throw new Error(`Missing relation target: ${targetKey}`);
    }
    throw new Error(`Ambiguous relation target: ${targetKey}`);
}
