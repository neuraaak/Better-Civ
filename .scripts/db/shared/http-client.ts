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

// Resolves to null when the asset is absent upstream: a few referenced
// images 404, which must not abort a whole download run.
export type FetchBinary = (url: string, signal: AbortSignal) => Promise<Uint8Array | null>;

export function createFetchBinary(timeoutMs = 30_000): FetchBinary {
    return async (url, signal) => {
        const timeout = AbortSignal.timeout(timeoutMs);
        const response = await fetch(url, { signal: AbortSignal.any([signal, timeout]) });
        if (response.status === 404) return null;
        if (!response.ok)
            throw new Error(`civvapi responded with HTTP ${response.status} for ${url}`);
        return new Uint8Array(await response.arrayBuffer());
    };
}
