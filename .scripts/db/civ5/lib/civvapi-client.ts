import { CIV5_API_ROOT } from '../constants';
import type { FetchJson } from '../../shared/http-client';
import { assertApiDocuments } from '../../shared/validation';
import type { ApiDocument, Language, ResourceKind } from '../types';

export async function fetchResourceList(
    kind: ResourceKind,
    language: Language,
    fetchJson: FetchJson,
    signal = new AbortController().signal
): Promise<ApiDocument[]> {
    const payload = await fetchJson(`${CIV5_API_ROOT}/v1/${language}/${kind}/${kind}.json`, signal);
    assertApiDocuments(payload);
    return payload;
}
