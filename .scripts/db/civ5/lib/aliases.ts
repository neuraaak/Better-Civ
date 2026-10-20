const CIV5_RELATION_ALIASES_V1: Readonly<Record<string, string>> = {
    'buildings/alhambra': 'wonders/alhambra',
    'units/khan': 'specialists/khan',
    'promotions/accuracy_i': 'promotions/accuracy_i_r',
};

export function resolveRelationTarget(targetKey: string, entityCodes: ReadonlySet<string>): string {
    const candidates = new Set<string>();
    if (entityCodes.has(targetKey)) candidates.add(targetKey);
    const alias = CIV5_RELATION_ALIASES_V1[targetKey];
    if (alias && entityCodes.has(alias)) candidates.add(alias);

    if (candidates.size === 1) return [...candidates][0];
    if (candidates.size === 0) throw new Error(`Missing relation target: ${targetKey}`);
    throw new Error(`Ambiguous relation target: ${targetKey}`);
}
