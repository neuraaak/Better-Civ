import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';
import { fetchCivilizations } from '@/api/civDb';
import { clearCivilizationsCache } from '@/composables/useCivilizations';
import { useAppStore } from '@/stores/app';
import { createTestRouter } from '../utils/router';

vi.mock('@/api/civDb', () => ({ fetchCivilizations: vi.fn() }));

// The header and the game view are lazy-loaded: wait for their dynamic imports to resolve
const mountApp = async (path = '/civilization-5') => {
    const router = await createTestRouter(path);
    const wrapper = mount(App, { global: { plugins: [router] } });
    await vi.dynamicImportSettled();
    await flushPromises();
    return Object.assign(wrapper, { router });
};

const cardNames = (wrapper: Awaited<ReturnType<typeof mountApp>>) =>
    wrapper.findAll('.portrait-card h2').map(title => title.text());

describe('App.vue', () => {
    const fetchMock = vi.mocked(fetchCivilizations);

    beforeEach(() => {
        setActivePinia(createPinia());
        clearCivilizationsCache();
        fetchMock.mockReset();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the header and the rated civilizations of the current language', async () => {
        fetchMock.mockResolvedValue([
            { id: 20, name: 'Inca|Incas' },
            { id: 21, name: 'Espagne' },
        ]);

        const wrapper = await mountApp();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe('fr');
        expect(wrapper.find('.brand-title').text()).toBe('Better-Civ');
        // Inca is tier S, Spain tier B
        expect(cardNames(wrapper)).toEqual(['Inca', 'Espagne']);
    });

    it('shows an error with a working retry when the database fails', async () => {
        fetchMock.mockRejectedValueOnce(new Error('offline'));
        const wrapper = await mountApp();

        expect(wrapper.find('[role="alert"]').text()).toContain(
            'Impossible de charger les civilisations.'
        );

        fetchMock.mockResolvedValueOnce([{ id: 24, name: 'Corée' }]);
        await wrapper.find('[role="alert"] button').trigger('click');
        await flushPromises();

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(cardNames(wrapper)).toEqual(['Corée']);
    });

    it('reloads the list when the language changes', async () => {
        fetchMock.mockImplementation(lang =>
            Promise.resolve([{ id: 7, name: lang === 'en' ? 'France (EN)' : 'France' }])
        );
        const wrapper = await mountApp();

        useAppStore().setLanguage('en');
        await flushPromises();

        expect(fetchMock.mock.calls[1][0]).toBe('en');
        expect(cardNames(wrapper)).toEqual(['France (EN)']);
        expect(wrapper.find('.hero h1').text()).toBe('Which civilization should you play?');
        expect(document.documentElement.lang).toBe('en');
    });

    it('exposes the BCP 47 tag of the selected language on <html>', async () => {
        fetchMock.mockResolvedValue([]);
        await mountApp();
        expect(document.documentElement.lang).toBe('fr');

        useAppStore().setLanguage('jp');
        await flushPromises();

        expect(document.documentElement.lang).toBe('ja');
    });

    describe('routes', () => {
        it('serves the home page on /', async () => {
            fetchMock.mockResolvedValue([]);
            const wrapper = await mountApp('/');

            expect(wrapper.router.currentRoute.value.name).toBe('home');
            expect(wrapper.findAll('.cards .card')).toHaveLength(3);
            expect(document.title).toBe('Better Civ');
            // The home page needs no civilization data
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('serves the tier list on /civilization-5', async () => {
            fetchMock.mockResolvedValue([{ id: 21, name: 'Espagne' }]);
            const wrapper = await mountApp('/civilization-5');

            expect(wrapper.router.currentRoute.value.name).toBe('civilization-5');
            expect(cardNames(wrapper)).toEqual(['Espagne']);
        });

        it('shows the 403 page and the 404 page on unknown paths', async () => {
            fetchMock.mockResolvedValue([]);

            const forbidden = await mountApp('/403');
            expect(forbidden.find('.status .eyebrow').text()).toBe('403');
            forbidden.unmount();

            const notFound = await mountApp('/nope/deep');
            expect(notFound.router.currentRoute.value.path).toBe('/nope/deep');
            expect(notFound.find('.not-found .code').text()).toBe('CDIV');
            notFound.unmount();

            // The database is never read outside the Civilization V tier list
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('shows the work in progress page on the unreleased games', async () => {
            fetchMock.mockResolvedValue([]);

            for (const [path, numeral] of [
                ['/civilization-6', 'VI'],
                ['/civilization-7', 'VII'],
            ]) {
                const wrapper = await mountApp(path);
                expect(wrapper.router.currentRoute.value.path).toBe(path);
                expect(wrapper.find('.wip .watermark').text()).toBe(numeral);
                expect(wrapper.find('.wip h1').text()).toBe(
                    'La tier list est encore en cours de recherche'
                );
                wrapper.unmount();
            }
            expect(fetchMock).not.toHaveBeenCalled();
        });
    });
});
