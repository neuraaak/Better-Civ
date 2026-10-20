import { CIV5_API_ROOT, CIV5_LANGUAGES, CIV5_RESOURCE_KINDS } from '../constants';
import type { ApiDocument, Language, NormalizedResource, ResourceKind } from '../types';

const apiUrl = new URL(CIV5_API_ROOT);

export function canonicalResourceKey(sourceUrl: string): string {
    const url = new URL(sourceUrl);
    if (url.protocol !== 'https:' || url.hostname !== apiUrl.hostname) {
        throw new TypeError(`Expected a civvapi HTTPS URL, got ${sourceUrl}`);
    }

    const [, apiName, version, language, kind, fileName] = url.pathname.split('/');
    if (
        apiName !== 'civvapi' ||
        version !== 'v1' ||
        !CIV5_LANGUAGES.includes(language as Language) ||
        !CIV5_RESOURCE_KINDS.includes(kind as ResourceKind) ||
        !fileName?.endsWith('.json')
    ) {
        throw new TypeError(`Expected a civvapi resource URL, got ${sourceUrl}`);
    }

    return `${kind}/${fileName.slice(0, -'.json'.length)}`;
}

export function deduplicateResources<T extends { resourceKey: string }>(
    resources: readonly T[]
): T[] {
    const unique = new Map<string, T>();
    for (const resource of resources)
        unique.set(resource.resourceKey, unique.get(resource.resourceKey) ?? resource);
    return [...unique.values()];
}

export function assertSameResourceKeys(
    expected: readonly string[],
    actual: readonly string[],
    kind: ResourceKind,
    language: Language
): void {
    const expectedKeys = new Set(expected);
    const actualKeys = new Set(actual);
    const missing = [...expectedKeys].filter(key => !actualKeys.has(key));
    const unexpected = [...actualKeys].filter(key => !expectedKeys.has(key));
    if (missing.length > 0 || unexpected.length > 0) {
        throw new Error(`Missing or unexpected ${kind} resource keys in ${language}`);
    }
}

export function normalizeResource(
    kind: ResourceKind,
    language: Language,
    document: ApiDocument
): NormalizedResource {
    if (typeof document.url !== 'string') {
        throw new TypeError(`Missing URL for ${kind} resource in ${language}`);
    }
    const resourceKey = canonicalResourceKey(document.url);
    if (!resourceKey.startsWith(`${kind}/`)) {
        throw new TypeError(`Unexpected resource kind in ${document.url}`);
    }

    return {
        kind,
        language,
        resourceKey,
        sourceUrl: document.url,
        name: typeof document.name === 'string' ? document.name : null,
        payload: document,
    };
}
