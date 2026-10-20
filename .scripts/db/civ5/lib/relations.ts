import { canonicalResourceKey } from './normalize';
import type { ApiDocument, ApiValue, ResourceRelation } from '../types';

function visit(
    value: ApiValue,
    path: string,
    position: number | null,
    relations: ResourceRelation[]
): void {
    if (typeof value === 'string') {
        try {
            const targetKey = canonicalResourceKey(value);
            const [targetKind] = targetKey.split('/');
            relations.push({
                targetKind: targetKind as ResourceRelation['targetKind'],
                targetKey,
                path,
                position,
            });
        } catch {
            // Only civvapi resource URLs are relationships.
        }
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, `${path}[${index}]`, index, relations));
        return;
    }
    if (value !== null && typeof value === 'object') {
        for (const [key, nested] of Object.entries(value)) {
            visit(nested, path ? `${path}.${key}` : key, position, relations);
        }
    }
}

export function extractResourceRelations(document: ApiDocument): ResourceRelation[] {
    const relations: ResourceRelation[] = [];
    visit(document, '', null, relations);
    return relations;
}
