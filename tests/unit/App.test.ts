import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';
import { clearCivilizationsCache } from '@/composables/useCivilizations';
import { useAppStore } from '@/stores/app';

const jsonResponse = (body: unknown, status = 200) =>
    Promise.resolve(new Response(JSON.stringify(body), { status }));

// Header and Content are async components: wait for their dynamic imports to resolve
const mountApp = async () => {
    const wrapper = mount(App);
    await vi.dynamicImportSettled();
    await flushPromises();
    return wrapper;
};

const cardNames = (wrapper: Awaited<ReturnType<typeof mountApp>>) =>
    wrapper.findAll('.portrait-card h2').map(title => title.text());

describe('App.vue', () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        setActivePinia(createPinia());
        clearCivilizationsCache();
        fetchMock.mockReset();
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('renders the header and the rated civilizations of the current language', async () => {
        fetchMock.mockImplementation(() =>
            jsonResponse([
                { id: 20, name: 'Inca|Incas' },
                { id: 21, name: 'Espagne' },
            ])
        );

        const wrapper = await mountApp();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toContain('/v1/fr/civilizations/');
        expect(wrapper.find('.brand-title').text()).toBe('Tier List');
        // Inca is tier S, Spain tier B
        expect(cardNames(wrapper)).toEqual(['Inca', 'Espagne']);
    });

    it('shows an error with a working retry when the API fails', async () => {
        fetchMock.mockImplementationOnce(() => jsonResponse({}, 500));
        const wrapper = await mountApp();

        expect(wrapper.find('[role="alert"]').text()).toContain(
            'Impossible de charger les civilisations.'
        );

        fetchMock.mockImplementationOnce(() => jsonResponse([{ id: 24, name: 'Corée' }]));
        await wrapper.find('[role="alert"] button').trigger('click');
        await flushPromises();

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(cardNames(wrapper)).toEqual(['Corée']);
    });

    it('reloads the list when the language changes', async () => {
        fetchMock.mockImplementation((url: string) =>
            jsonResponse([{ id: 7, name: url.includes('/en/') ? 'France (EN)' : 'France' }])
        );
        const wrapper = await mountApp();

        useAppStore().setLanguage('en');
        await flushPromises();

        expect(fetchMock.mock.calls[1][0]).toContain('/v1/en/civilizations/');
        expect(cardNames(wrapper)).toEqual(['France (EN)']);
        expect(wrapper.find('.hero h1').text()).toBe('Which civilization should you play?');
    });
});
