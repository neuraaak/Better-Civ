import { afterEach, describe, it, expect, beforeEach } from 'vitest';
import { enableAutoUnmount, flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ContentComponent from '@/components/layout/ContentComponent.vue';
import type { LoadStatus } from '@/composables/useCivilizations';
import { useAppStore } from '@/stores/app';
import type { Civilization } from '@/types';

// Unmount between tests so window keydown listeners do not leak across tests
enableAutoUnmount(afterEach);

describe('ContentComponent', () => {
    const mockCivilizations: Civilization[] = [
        {
            id: 1,
            name: 'France',
            icon: '/img/france.png',
            historical_info: [{ text: 'A cultural civilization' }],
            tags_id: [1, 2],
            tier_id: 2,
            leader: {
                name: 'Napoleon',
                subtitle: 'Empereur des Français',
                icon: '/img/napoleon.png',
                trait: { name: 'Ancien Régime', effect: 'Gain +2 Culture from each building' },
                historical_info: [{ text: 'Napoléon Bonaparte...' }],
            },
            unique_units: ['Musketeer'],
            unique_buildings: ['Chateau'],
        },
        {
            id: 2,
            name: 'Germany',
            icon: '/img/germany.png',
            historical_info: [{ text: 'A military civilization' }],
            tags_id: [3, 4],
            tier_id: 1,
            leader: {
                name: 'Bismarck',
                icon: '/img/bismarck.png',
                trait: { effect: 'Gain +2 Production from each mine' },
            },
            unique_units: ['Panzer'],
            unique_buildings: ['Hans'],
        },
        {
            id: 3,
            name: 'Égypte',
            icon: '/img/egypt.png',
            historical_info: [{ text: 'Le Nil' }],
            tags_id: [4],
            tier_id: 2,
            leader: { name: 'Ramsès II', icon: '/img/ramses.png', trait: { effect: 'Merveilles' } },
            unique_units: [],
            unique_buildings: [],
        },
    ];

    const mountContent = (civilisations = mockCivilizations, status: LoadStatus = 'ready') =>
        mount(ContentComponent, { props: { civilisations, status }, attachTo: document.body });

    /** Ids of the cards in display order. */
    const visibleIds = (wrapper: VueWrapper) =>
        wrapper.findAllComponents({ name: 'CivCardComponent' }).map(card => card.props('id'));

    beforeEach(() => {
        setActivePinia(createPinia());
        document.body.innerHTML = '';
    });

    describe('Hero and filter bar', () => {
        it('renders the hero with a roman-numeral count', () => {
            const wrapper = mountContent();

            expect(wrapper.find('.hero h1').text()).toBe('Quelle civilisation jouer ?');
            expect(wrapper.find('.eyebrow').text()).toContain('Classement · III civilisations');
        });

        it('renders search, the filters button, the result count and the grouping toggle', () => {
            const wrapper = mountContent();

            expect(wrapper.find('.search-control input').attributes('placeholder')).toBe(
                'Rechercher une civilisation'
            );
            expect(wrapper.find('.filters-toggle').text()).toBe('Filtres');
            expect(wrapper.find('.result-count').text()).toBe('3 résultats');
            const toggle = wrapper.findAll('.sort-toggle button');
            expect(toggle.map(button => button.text())).toEqual(['Par tier', 'A → Z']);
            expect(toggle[1].attributes('title')).toBe('Alphabétique');
            expect(wrapper.find('.active-filters').exists()).toBe(false);
        });

        it('uses the singular for a single result', async () => {
            const wrapper = mountContent();

            await wrapper.find('.search-control input').setValue('egy');

            expect(wrapper.find('.result-count').text()).toBe('1 résultat');
        });

        it('renders the cards in the requested style', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations, cardStyle: 'classic' },
            });

            expect(wrapper.findAll('.classic-card')).toHaveLength(3);
            expect(wrapper.find('.portrait-card').exists()).toBe(false);
        });

        it('starts on the requested grouping', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations, defaultGroupMode: 'alpha' },
            });

            expect(wrapper.find('.tier-heading').exists()).toBe(false);
            expect(visibleIds(wrapper)).toEqual([3, 1, 2]);
        });
    });

    describe('Filter panel', () => {
        const openFilters = async (wrapper: VueWrapper) => {
            await wrapper.find('.filters-toggle').trigger('click');
        };
        const tile = (wrapper: VueWrapper, index: number) =>
            wrapper.findAll('[data-testid="category-tile"]')[index];

        it('opens from the filters button and closes from it again', async () => {
            const wrapper = mountContent();
            const button = wrapper.find('.filters-toggle');
            expect(button.attributes('aria-expanded')).toBe('false');
            expect(wrapper.find('.filter-panel').classes()).not.toContain('open');

            await openFilters(wrapper);
            expect(button.attributes('aria-expanded')).toBe('true');
            expect(button.classes()).toContain('open');
            expect(wrapper.find('.filter-panel').classes()).toContain('open');

            await openFilters(wrapper);
            expect(wrapper.find('.filter-panel').classes()).not.toContain('open');
        });

        it('closes on Escape, on a click beside it and from "Voir N résultats"', async () => {
            const wrapper = mountContent();

            await openFilters(wrapper);
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.filter-panel').classes()).not.toContain('open');

            await openFilters(wrapper);
            await wrapper.find('.filters-backdrop').trigger('click');
            expect(wrapper.find('.filters-backdrop').exists()).toBe(false);

            await openFilters(wrapper);
            const apply = wrapper.find('.filter-apply');
            expect(apply.text()).toBe('Voir 3 résultats');
            await apply.trigger('click');
            expect(wrapper.find('.filter-panel').classes()).not.toContain('open');
        });

        it('gives the focus back to the filters button when it closes from inside', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);
            wrapper.find<HTMLElement>('.include-button').element.focus();

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await wrapper.vm.$nextTick();

            expect(document.activeElement).toBe(wrapper.find('.filters-toggle').element);
        });

        it('closes the filter panel before the detail panel on Escape', async () => {
            const wrapper = mountContent();
            useAppStore().openDetail(1);
            await openFilters(wrapper);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await wrapper.vm.$nextTick();

            expect(wrapper.find('.filter-panel').classes()).not.toContain('open');
            expect(useAppStore().detailOpen).toBe(true);
        });

        it('includes a category from its tile and excludes another one', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);

            await tile(wrapper, 4).find('.category-tile-main').trigger('click'); // Militaire
            expect(visibleIds(wrapper)).toEqual([2, 3]);
            expect(tile(wrapper, 4).classes()).toContain('included');

            await tile(wrapper, 3).find('.exclude-button').trigger('click'); // Science
            expect(visibleIds(wrapper)).toEqual([3]);
            expect(tile(wrapper, 3).classes()).toContain('excluded');
            expect(tile(wrapper, 3).find('.exclude-button').attributes('aria-pressed')).toBe(
                'true'
            );

            expect(wrapper.find('.filters-count').text()).toBe('2');
            expect(wrapper.find('.filters-toggle').classes()).toContain('active');
        });

        it('switches a category from included to excluded with its buttons', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);

            await tile(wrapper, 4).find('.include-button').trigger('click');
            await tile(wrapper, 4).find('.exclude-button').trigger('click');

            expect(tile(wrapper, 4).classes()).toContain('excluded');
            expect(tile(wrapper, 4).classes()).not.toContain('included');
            expect(visibleIds(wrapper)).toEqual([1]);
        });

        it('picks several tiers and dims the others', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);
            const tiers = () => wrapper.findAll('[data-testid="tier-tile"]');

            await tiers()[1].trigger('click'); // Tier A
            await tiers()[2].trigger('click'); // Tier B
            expect(visibleIds(wrapper)).toEqual([2, 3, 1]);
            expect(tiers()[1].find('.tier-check').exists()).toBe(true);
            expect(tiers()[0].find('.tier-badge').attributes('style')).toContain('opacity: 0.4');

            await tiers()[2].trigger('click');
            expect(visibleIds(wrapper)).toEqual([2]);
        });

        it('shows roman counts over every civilization on the tiles', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);

            expect(tile(wrapper, 4).find('.filter-count').text()).toBe('II');
            expect(tile(wrapper, 0).find('.filter-count').text()).toBe('—');
            const tierCounts = wrapper
                .findAll('[data-testid="tier-tile"] .filter-count')
                .map(count => count.text());
            expect(tierCounts).toEqual(['—', 'I', 'II', '—', '—']);
        });

        it('resets the categories and tiers from the panel', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);
            await tile(wrapper, 4).find('.category-tile-main').trigger('click');

            await wrapper.find('.filter-reset').trigger('click');

            expect(visibleIds(wrapper)).toHaveLength(3);
            expect(wrapper.find('.filters-count').exists()).toBe(false);
        });

        it('lists the active filters as removable pills', async () => {
            const wrapper = mountContent();
            await openFilters(wrapper);
            await tile(wrapper, 4).find('.category-tile-main').trigger('click');
            await tile(wrapper, 3).find('.exclude-button').trigger('click');
            await wrapper.findAll('[data-testid="tier-tile"]')[2].trigger('click');

            const pills = () => wrapper.findAll('[data-testid="filter-pill"]');
            expect(pills().map(pill => pill.text())).toEqual([
                'InclureMilitaire',
                'ExclureScience',
                'TierBRoyaume', // kind, badge letter, rank
            ]);
            expect(pills()[2].findComponent({ name: 'CivTierComponent' }).props('size')).toBe(18);
            expect(pills()[0].find('.pill-remove').attributes('aria-label')).toBe(
                'Retirer Militaire'
            );
            expect(visibleIds(wrapper)).toEqual([3]);

            await pills()[1].find('.pill-remove').trigger('click');
            expect(visibleIds(wrapper)).toEqual([3]);
            expect(pills()).toHaveLength(2);

            await pills()[0].find('.pill-remove').trigger('click');
            await pills()[0].find('.pill-remove').trigger('click');
            expect(visibleIds(wrapper)).toHaveLength(3);

            await tile(wrapper, 4).find('.category-tile-main').trigger('click');
            await wrapper.find('.clear-all').trigger('click');
            expect(wrapper.find('.active-filters').exists()).toBe(false);
        });
    });

    describe('Filtering', () => {
        it('searches on the name, ignoring accents and case', async () => {
            const wrapper = mountContent();

            await wrapper.find('.search-control input').setValue('egy');
            expect(visibleIds(wrapper)).toEqual([3]);

            await wrapper.find('.search-control input').setValue('production');
            expect(visibleIds(wrapper)).toHaveLength(0);
        });

        it('shows the empty state and resets every filter', async () => {
            const wrapper = mountContent();

            await wrapper.find('.search-control input').setValue('zzz');
            expect(wrapper.find('.empty-state').exists()).toBe(true);

            await wrapper.find('.empty-state button').trigger('click');
            expect(visibleIds(wrapper)).toHaveLength(3);
        });
    });

    describe('Grouping', () => {
        it('groups by tier with rank, description and roman count', () => {
            const wrapper = mountContent();
            const sections = wrapper.findAll('[data-testid="tier-section"]');

            expect(sections).toHaveLength(2);
            expect(sections[0].find('.tier-rank').text()).toBe('Empire');
            expect(sections[1].find('.tier-heading p').text()).toBe(
                'Solides — demandent un peu plus de maîtrise'
            );
            expect(sections[1].find('.tier-count').text()).toBe('II');
            expect(sections[1].find('.meander').exists()).toBe(true);
        });

        it('sorts alphabetically inside a tier and in A → Z mode', async () => {
            const wrapper = mountContent();
            const names = () =>
                wrapper
                    .findAllComponents({ name: 'CivCardComponent' })
                    .map(card => card.props('name'));

            expect(names()).toEqual(['Germany', 'Égypte', 'France']);

            await wrapper.findAll('.sort-toggle button')[1].trigger('click');
            expect(wrapper.find('.tier-heading').exists()).toBe(false);
            expect(names()).toEqual(['Égypte', 'France', 'Germany']);
        });
    });

    describe('Detail panel', () => {
        const openCiv = async (wrapper: VueWrapper, id: number) => {
            useAppStore().openDetail(id);
            await wrapper.vm.$nextTick();
        };

        it('is closed initially', () => {
            const wrapper = mountContent();

            expect(wrapper.find('.content-overlay').classes()).toContain('hidden');
            expect(wrapper.find('.detail-panel').classes()).not.toContain('open');
        });

        it('opens on the selected civilization and highlights its card', async () => {
            const wrapper = mountContent();
            await openCiv(wrapper, 1);

            expect(wrapper.find('.detail-panel').classes()).toContain('open');
            const panel = wrapper.findComponent({ name: 'MasterCardComponent' });
            expect(panel.props('civ')).toMatchObject({ id: 1, name: 'France' });
            expect(panel.props('position')).toBe('III / III');

            const selected = wrapper
                .findAllComponents({ name: 'CivCardComponent' })
                .filter(card => card.props('selected'));
            expect(selected.map(card => card.props('id'))).toEqual([1]);
        });

        it('steps through the visible order with the arrow keys and wraps around', async () => {
            const wrapper = mountContent();
            await openCiv(wrapper, 1);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            await wrapper.vm.$nextTick();
            expect(useAppStore().selectedCivId).toBe(2);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            await wrapper.vm.$nextTick();
            expect(useAppStore().selectedCivId).toBe(1);
        });

        it('closes on Escape and on backdrop click', async () => {
            const wrapper = mountContent();
            await openCiv(wrapper, 1);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.detail-panel').classes()).not.toContain('open');

            await openCiv(wrapper, 1);
            await wrapper.find('.content-overlay').trigger('click');
            expect(wrapper.find('.detail-panel').classes()).not.toContain('open');
        });

        it('moves to the neighbouring civilization from the panel buttons', async () => {
            const wrapper = mountContent();
            await openCiv(wrapper, 2);

            const panel = wrapper.findComponent({ name: 'MasterCardComponent' });
            expect(panel.props('previous_name')).toBe('France');
            expect(panel.props('next_name')).toBe('Égypte');

            panel.vm.$emit('next');
            await wrapper.vm.$nextTick();
            expect(useAppStore().selectedCivId).toBe(3);
        });

        it('focuses the close button on open and gives focus back to the card on close', async () => {
            const wrapper = mountContent();
            const card = wrapper.find<HTMLElement>('.portrait-card');
            card.element.focus();

            await card.trigger('click');
            await flushPromises();
            expect(document.activeElement?.classList.contains('panel-close')).toBe(true);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await flushPromises();
            expect(document.activeElement).toBe(card.element);
        });

        it('ignores keys when the panel is closed or the list is empty', () => {
            mountContent([]);

            expect(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            }).not.toThrow();
            expect(useAppStore().selectedCivId).toBe(null);
        });
    });

    describe('Loading states', () => {
        it('shows a loading message before the first list arrives', () => {
            const wrapper = mountContent([], 'loading');

            expect(wrapper.find('.empty-state h2').text()).toBe('Chargement des civilisations…');
            expect(wrapper.find('.empty-state button').exists()).toBe(false);
        });

        it('keeps the previous list visible while another language loads', () => {
            const wrapper = mountContent(mockCivilizations, 'loading');

            expect(visibleIds(wrapper)).toHaveLength(3);
        });

        it('shows the error with a retry button that emits retry', async () => {
            const wrapper = mountContent([], 'error');

            expect(wrapper.find('.empty-state[role="alert"] h2').text()).toBe(
                'Impossible de charger les civilisations.'
            );
            await wrapper.find('.empty-state button').trigger('click');
            expect(wrapper.emitted('retry')).toHaveLength(1);
        });
    });
});
