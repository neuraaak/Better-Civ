export type FetchJson = (url: string, signal: AbortSignal) => Promise<unknown>;

export function createFetchJson(timeoutMs = 30_000): FetchJson {
    return async (url, signal) => {
        const timeout = AbortSignal.timeout(timeoutMs);
        const response = await fetch(url, { signal: AbortSignal.any([signal, timeout]) });
        if (!response.ok)
            throw new Error(`civvapi responded with HTTP ${response.status} for ${url}`);
        return response.json();
    };
}
