import type { CIV5_LANGUAGES, CIV5_RESOURCE_KINDS } from './constants';

export type ResourceKind = (typeof CIV5_RESOURCE_KINDS)[number];
export type Language = (typeof CIV5_LANGUAGES)[number];
export type ApiValue = string | number | boolean | null | ApiDocument | ApiValue[];
export type ApiDocument = { [key: string]: ApiValue };

export interface NormalizedResource {
    kind: ResourceKind;
    language: Language;
    resourceKey: string;
    sourceUrl: string;
    sourceId: number | null;
    name: string | null;
    payload: ApiDocument;
}

export interface StagedResource extends NormalizedResource {}

export interface ResourceRelation {
    targetKind: ResourceKind;
    targetKey: string;
    path: string;
    position: number | null;
}

export interface ImportSummary {
    families: number;
    languages: number;
    resources: number;
    entities: number;
    translations: number;
}
