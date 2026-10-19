import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ContentComponent from '@/components/layout/ContentComponent.vue';
import { translationStore } from '@/stores/index';

describe('ContentComponent', () => {
    const mockCivilizations = [
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

    const mountContent = (civilisations = mockCivilizations) =>
        mount(ContentComponent, { props: { civilisations }, attachTo: document.body });

    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('Hero and filter bar', () => {
        it('renders the hero with a roman-numeral count', () => {
            const wrapper = mountContent();

            expect(wrapper.find('.hero h1').text()).toBe('Quelle civilisation jouer ?');
            expect(wrapper.find('.eyebrow').text()).toContain('Classement · III civilisations');
        });

        it('renders search, category chips, tier chips and the grouping toggle', () => {
            const wrapper = mountContent();

            expect(wrapper.find('.search-control input').attributes('placeholder')).toBe(
                'Rechercher une civilisation'
            );
            // "Toutes" + the 7 categories of the store
            expect(wrapper.findAll('.category-chip')).toHaveLength(8);
            expect(wrapper.findAll('.tier-chip')).toHaveLength(5);
            expect(wrapper.findAll('.sort-toggle button')).toHaveLength(2);
            expect(wrapper.find('.result-count').text()).toBe('3 résultats');
        });

        it('colours each category dot with its category colour', () => {
            const wrapper = mountContent();
            const dots = wrapper.findAll('.category-chip .dot');

            expect(dots[0].attributes('style')).toContain('var(--color-neutral-600)');
            expect(dots[2].attributes('style')).toContain('oklch(0.74 0.11 310)'); // Culture
        });
    });

    describe('Filtering', () => {
        it('filters by category', async () => {
            const wrapper = mountContent();

            await wrapper.findAll('.category-chip')[5].trigger('click'); // Militaire (tag 4)

            expect((wrapper.vm as any).filteredCivilisations.map((civ: any) => civ.id)).toEqual([
                2, 3,
            ]);
        });

        it('filters by tier, dims the other tier chips and toggles back off', async () => {
            const wrapper = mountContent();
            const chip = wrapper.findAll('.tier-chip')[1]; // Tier A

            await chip.trigger('click');
            expect((wrapper.vm as any).filteredCivilisations.map((civ: any) => civ.id)).toEqual([
                2,
            ]);
            expect(
                wrapper.findAll('.tier-chip')[0].find('.tier-badge').attributes('style')
            ).toContain('opacity: 0.35');

            await chip.trigger('click');
            expect((wrapper.vm as any).filteredCivilisations).toHaveLength(3);
        });

        it('searches on the name, ignoring accents and case', async () => {
            const wrapper = mountContent();

            await wrapper.find('.search-control input').setValue('egy');
            expect((wrapper.vm as any).filteredCivilisations.map((civ: any) => civ.id)).toEqual([
                3,
            ]);

            await wrapper.find('.search-control input').setValue('production');
            expect((wrapper.vm as any).filteredCivilisations).toHaveLength(0);
        });

        it('shows the empty state and resets every filter', async () => {
            const wrapper = mountContent();

            await wrapper.find('.search-control input').setValue('zzz');
            expect(wrapper.find('.empty-state').exists()).toBe(true);

            await wrapper.find('.empty-state button').trigger('click');
            expect((wrapper.vm as any).filteredCivilisations).toHaveLength(3);
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
        const openCiv = async (wrapper: any, id: number) => {
            const store = translationStore();
            store.setSelectedCard(id);
            store.setSelectedState(true);
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
            expect(panel.props('name')).toBe('France');
            expect(panel.props('civ_trait_name')).toBe('Ancien Régime');
            expect(panel.props('civ_leader_subtitle')).toBe('Empereur des Français');
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
            expect((wrapper.vm as any).selectedCard).toBe(2);

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            await wrapper.vm.$nextTick();
            expect((wrapper.vm as any).selectedCard).toBe(1);
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

        it('ignores keys when the panel is closed or the list is empty', () => {
            const wrapper = mountContent([]);

            expect(() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            }).not.toThrow();
            expect((wrapper.vm as any).selectedCard).toBe(null);
        });
    });
});
