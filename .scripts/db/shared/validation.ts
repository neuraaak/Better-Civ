import type { ApiDocument } from '../civ5/types';

export function isApiDocument(value: unknown): value is ApiDocument {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function assertApiDocuments(value: unknown): asserts value is ApiDocument[] {
    if (!Array.isArray(value) || !value.every(isApiDocument)) {
        throw new TypeError('Expected an array of JSON objects');
    }
}
