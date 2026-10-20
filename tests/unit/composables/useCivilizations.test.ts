import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { effectScope, ref, type EffectScope } from 'vue';
import { clearCivilizationsCache, useCivilizations } from '@/composables/useCivilizations';
import type { Lang } from '@/i18n/languages';

describe('useCivilizations', () => {
    const fetchMock = vi.fn();
    let scope: EffectScope;

    /** Resolves with one civilization named after the language of the URL. */
    const answerWithLanguage = (url: string) => {
        const lang = url.split('/v1/')[1].split('/')[0];
        return Promise.resolve(new Response(JSON.stringify([{ id: 20, name: `Inca-${lang}` }])));
    };

    const setup = (initial: Lang = 'fr') => {
        const lang = ref<Lang>(initial);
        scope = effectScope();
        const result = scope.run(() => useCivilizations(lang))!;
        return { lang, ...result };
    };

    beforeEach(() => {
        clearCivilizationsCache();
        fetchMock.mockReset();
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        scope?.stop();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('loads and rates the civilizations of the current language', async () => {
        fetchMock.mockImplementation(answerWithLanguage);
        const { civilizations, status } = setup();

        expect(status.value).toBe('loading');
        await flushPromises();

        expect(status.value).toBe('ready');
        expect(civilizations.value).toEqual([
            { id: 20, name: 'Inca-fr', tags_id: [0], tier_id: 0 },
        ]);
    });

    it('reports an error for a failed request and recovers on retry', async () => {
        fetchMock.mockResolvedValueOnce(new Response('', { status: 500 }));
        const { civilizations, status, retry } = setup();
        await flushPromises();

        expect(status.value).toBe('error');
        expect(civilizations.value).toEqual([]);

        fetchMock.mockImplementation(answerWithLanguage);
        await retry();

        expect(status.value).toBe('ready');
        expect(civilizations.value).toHaveLength(1);
    });

    it('drops the previous language list when the new one fails to load', async () => {
        fetchMock.mockImplementationOnce(answerWithLanguage);
        const { lang, civilizations, status } = setup();
        await flushPromises();

        fetchMock.mockResolvedValueOnce(new Response('', { status: 500 }));
        lang.value = 'de';
        await flushPromises();

        expect(status.value).toBe('error');
        expect(civilizations.value).toEqual([]);
    });

    it('reports an error for an invalid payload', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ not: 'a list' })));
        const { status } = setup();
        await flushPromises();

        expect(status.value).toBe('error');
    });

    it('serves a language already loaded from the cache', async () => {
        fetchMock.mockImplementation(answerWithLanguage);
        const { lang, civilizations } = setup();
        await flushPromises();

        lang.value = 'en';
        await flushPromises();
        lang.value = 'fr';
        await flushPromises();

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(civilizations.value[0].name).toBe('Inca-fr');
    });

    it('aborts a pending request so a slow response cannot overwrite a newer language', async () => {
        const signals: AbortSignal[] = [];
        let resolveFrench: (response: Response) => void = () => {};
        fetchMock.mockImplementation((url: string, init: RequestInit) => {
            signals.push(init.signal!);
            if (url.includes('/fr/')) return new Promise(resolve => (resolveFrench = resolve));
            return answerWithLanguage(url);
        });
        const { lang, civilizations, status } = setup();

        lang.value = 'en';
        await flushPromises();
        resolveFrench(new Response(JSON.stringify([{ id: 20, name: 'Inca-fr' }])));
        await flushPromises();

        expect(signals[0].aborted).toBe(true);
        expect(status.value).toBe('ready');
        expect(civilizations.value[0].name).toBe('Inca-en');
    });

    it('aborts the pending request when its scope is disposed', () => {
        fetchMock.mockImplementation(() => new Promise(() => {}));
        setup();

        scope.stop();

        expect((fetchMock.mock.calls[0][1] as RequestInit).signal!.aborted).toBe(true);
    });
});
