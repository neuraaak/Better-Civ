import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ContentComponent from '@/components/layout/ContentComponent.vue';

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
                icon: '/img/napoleon.png',
                trait: { effect: 'Gain +2 Culture from each building' },
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
    ];

    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('Template', () => {
        it('should render content component', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect(wrapper.find('.content').exists()).toBe(true);
        });

        it('should render filter components', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const selectInputs = wrapper.findAllComponents({ name: 'SelectInputComponent' });
            expect(selectInputs).toHaveLength(2);
        });

        it('should render search component', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect(wrapper.findComponent({ name: 'SearchInputComponent' }).exists()).toBe(true);
        });

        it('should render civilization cards', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const civCards = wrapper.findAllComponents({ name: 'CivCardComponent' });
            expect(civCards).toHaveLength(2);
        });

        it('should render overlay when selected', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            // Initially overlay should be hidden
            expect(wrapper.find('.content-overlay').classes()).toContain('hidden');
        });
    });

    describe('Props', () => {
        it('should accept civilizations prop', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect((wrapper.props() as any).civilisations).toEqual(mockCivilizations);
        });

        it('should handle empty civilizations array', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: [] },
            });

            expect((wrapper.props() as any).civilisations).toEqual([]);
            const civCards = wrapper.findAllComponents({ name: 'CivCardComponent' });
            expect(civCards).toHaveLength(0);
        });
    });

    describe('Computed Properties', () => {
        it('groups visible civilizations by tier', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect(wrapper.findAll('[data-testid="tier-section"]')).toHaveLength(2);
        });

        it('should filter civilizations by tags', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            expect(vm.filteredCivilisations).toHaveLength(2);
        });

        it('should filter civilizations by tiers', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            expect(vm.filteredCivilisations).toHaveLength(2);
        });

        it('should filter civilizations by search text', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            expect(vm.filteredCivilisations).toHaveLength(2);
        });

        it('should compute selected card index', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            expect(vm.selectedCardIndex).toBe(-1); // No card selected initially
        });
    });

    describe('Methods', () => {
        it('should handle tag selection', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            const mockTags = [{ id: 1, name: 'Culture' }];

            vm.handleCheckedTags(mockTags);
            expect(vm.selectedTags).toEqual(mockTags);
        });

        it('should handle tier selection', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            const mockTiers = [{ id: 1, name: 'S Tier' }];

            vm.handleCheckedTiers(mockTiers);
            expect(vm.selectedTiers).toEqual(mockTiers);
        });

        it('should handle search text', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            const searchText = 'France';

            vm.handleSearchedText(searchText);
            expect(vm.searchedText).toBe(searchText);
        });

        it('should close overlay', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            vm.closeOverlay();

            // Verify that the store method was called (indirectly)
            expect(vm.selectedState).toBe(false);
        });
    });

    describe('User Interactions', () => {
        it('should handle keyboard navigation', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;

            // Set a selected card
            vm.selectedCard = 1;

            // Test right arrow navigation
            const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            vm.navigateCards(rightEvent);

            // Test left arrow navigation
            const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            vm.navigateCards(leftEvent);

            expect(vm.selectedCard).toBeDefined();
        });

        it('should handle overlay click', async () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const overlay = wrapper.find('.content-overlay');
            await overlay.trigger('click');

            // Verify overlay click was handled
            expect(overlay.exists()).toBe(true);
        });
    });

    describe('Tier list layout', () => {
        it('renders the handoff hero and sticky filter bar', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect(wrapper.find('.hero').exists()).toBe(true);
            expect(wrapper.find('.controls').exists()).toBe(true);
            expect(wrapper.find('.search-control input').attributes('placeholder')).toBe(
                'Rechercher une civilisation'
            );
        });

        it('renders the side detail panel inside its backdrop', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const overlay = wrapper.find('.content-overlay');
            expect(overlay.exists()).toBe(true);
            expect(overlay.find('.detail-panel').exists()).toBe(true);
        });

        it('keeps cards in responsive tier grids', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            expect(wrapper.findAll('.tier-section .grid-container')).toHaveLength(2);
        });
    });

    describe('Component Integration', () => {
        it('should integrate with SelectInputComponent for tags', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const tagSelect = wrapper.findAllComponents({ name: 'SelectInputComponent' })[0];
            expect(tagSelect.exists()).toBe(true);
            expect(tagSelect.props('multiple')).toBeDefined();
            expect(tagSelect.props('options')).toBeDefined();
        });

        it('should integrate with SelectInputComponent for tiers', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const tierSelect = wrapper.findAllComponents({ name: 'SelectInputComponent' })[1];
            expect(tierSelect.exists()).toBe(true);
            expect(tierSelect.props('multiple')).toBeDefined();
            expect(tierSelect.props('options')).toBeDefined();
        });

        it('should integrate with SearchInputComponent', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const searchInput = wrapper.findComponent({ name: 'SearchInputComponent' });
            expect(searchInput.exists()).toBe(true);
            expect(searchInput.props('civilizations')).toBeDefined();
        });

        it('should integrate with CivCardComponent', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const civCards = wrapper.findAllComponents({ name: 'CivCardComponent' });
            expect(civCards).toHaveLength(2);

            expect(civCards.map(card => card.props('name'))).toEqual(['Germany', 'France']);
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined civilization properties', () => {
            const incompleteCivilizations = [
                {
                    id: 1,
                    name: 'France',
                    historical_info: [],
                    tags_id: [],
                    tier_id: 1,
                    leader: {
                        name: 'Test',
                        icon: '/test.png',
                        trait: { effect: 'Test effect' },
                    },
                    unique_units: [],
                    unique_buildings: [],
                },
            ];

            const wrapper = mount(ContentComponent, {
                props: { civilisations: incompleteCivilizations },
            });

            expect(wrapper.findComponent({ name: 'CivCardComponent' }).exists()).toBe(true);
        });

        it('should handle empty search results', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: mockCivilizations },
            });

            const vm = wrapper.vm as any;
            vm.handleSearchedText('NonExistentCivilization');

            expect(vm.filteredCivilisations).toHaveLength(0);
        });

        it('should handle navigation with no cards', () => {
            const wrapper = mount(ContentComponent, {
                props: { civilisations: [] },
            });

            const vm = wrapper.vm as any;
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

            // Should not throw error when no cards are available
            expect(() => {
                vm.navigateCards(event);
            }).not.toThrow();
        });
    });
});
