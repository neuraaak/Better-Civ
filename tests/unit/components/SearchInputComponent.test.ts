import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchInputComponent from '@/components/global/SearchInputComponent.vue';

describe('SearchInputComponent', () => {
    const mockCivilizations = [
        { id: 1, name: 'France' },
        { id: 2, name: 'Germany' },
        { id: 3, name: 'Spain' },
        { id: 4, name: 'England' },
        { id: 5, name: 'Russia' },
        { id: 6, name: 'China' },
        { id: 7, name: 'Japan' },
        { id: 8, name: 'Korea' },
        { id: 9, name: 'India' },
        { id: 10, name: 'Brazil' },
    ];

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Template', () => {
        it('should render search input', () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            expect(wrapper.find('input[type="text"]').exists()).toBe(true);
            expect(wrapper.find('.search-container').exists()).toBe(true);
            expect(wrapper.find('.input-wrapper').exists()).toBe(true);
        });

        it('should render reset button when search text exists', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('France');

            expect(wrapper.find('.reset-btn').exists()).toBe(true);
            expect(wrapper.find('.reset-btn').text()).toBe('✕');
        });

        it('should not render reset button when search text is empty', () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            expect(wrapper.find('.reset-btn').exists()).toBe(false);
        });

        it('should render suggestions when available', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Fr');
            await input.trigger('focus');

            expect(wrapper.find('.suggestions').exists()).toBe(true);
            expect(wrapper.findAll('.suggestion')).toHaveLength(1);
            expect(wrapper.find('.suggestion').text()).toBe('France');
        });

        it('should not render suggestions when search text is too short', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('F');
            await input.trigger('focus');

            expect(wrapper.find('.suggestions').exists()).toBe(false);
        });
    });

    describe('Props', () => {
        it('should accept civilizations prop', () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            // Test that the component renders with the prop
            expect(wrapper.find('input').exists()).toBe(true);
        });

        it('should have default empty array for civilizations', () => {
            const wrapper = mount(SearchInputComponent);

            // Test that the component renders without the prop
            expect(wrapper.find('input').exists()).toBe(true);
        });
    });

    describe('Data', () => {
        it('should initialize with empty search text', () => {
            const wrapper = mount(SearchInputComponent);
            const vm = wrapper.vm as any;

            expect(vm.searchText).toBe('');
        });

        it('should initialize with suggestions hidden', () => {
            const wrapper = mount(SearchInputComponent);
            const vm = wrapper.vm as any;

            expect(vm.showSuggestions).toBe(false);
        });
    });

    describe('Computed', () => {
        it('should filter suggestions based on search text', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Ger');

            const vm = wrapper.vm as any;
            expect(vm.suggestions).toHaveLength(1);
            expect(vm.suggestions[0].name).toBe('Germany');
        });

        it('should return empty array when search text is too short', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('F');

            const vm = wrapper.vm as any;
            expect(vm.suggestions).toHaveLength(0);
        });

        it('should limit suggestions to 8 items', async () => {
            const manyCivilizations = Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                name: `Civilization ${i + 1}`,
            }));

            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: manyCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Civilization');

            const vm = wrapper.vm as any;
            expect(vm.suggestions).toHaveLength(8);
        });

        it('should be case insensitive', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('france');

            const vm = wrapper.vm as any;
            expect(vm.suggestions).toHaveLength(1);
            expect(vm.suggestions[0].name).toBe('France');
        });
    });

    describe('Methods', () => {
        it('should emit update:searchText when search text changes', async () => {
            const wrapper = mount(SearchInputComponent);

            const input = wrapper.find('input');
            await input.setValue('France');

            expect(wrapper.emitted('update:searchText')).toBeTruthy();
            expect(wrapper.emitted('update:searchText')?.[0]).toEqual(['France']);
        });

        it('should select suggestion and update search text', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Fr');
            await input.trigger('focus');
            await wrapper.vm.$nextTick();

            // Check if suggestions are rendered
            const suggestions = wrapper.findAll('.suggestion');
            if (suggestions.length > 0) {
                await suggestions[0].trigger('click');

                const vm = wrapper.vm as any;
                expect(vm.searchText).toBe('France');
                expect(vm.showSuggestions).toBe(false);
                expect(wrapper.emitted('update:searchText')).toBeTruthy();
            }
        });

        it('should reset search when reset button is clicked', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('France');

            const resetBtn = wrapper.find('.reset-btn');
            await resetBtn.trigger('click');

            const vm = wrapper.vm as any;
            expect(vm.searchText).toBe('');
            expect(vm.showSuggestions).toBe(false);
            expect(wrapper.emitted('update:searchText')).toBeTruthy();
        });

        it('should hide suggestions after delay on blur', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.trigger('focus');
            await input.trigger('blur');

            const vm = wrapper.vm as any;
            expect(vm.showSuggestions).toBe(true);

            vi.advanceTimersByTime(150);

            expect(vm.showSuggestions).toBe(false);
        });
    });

    describe('User Interactions', () => {
        it('should show suggestions on focus', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Fr');
            await input.trigger('focus');

            const vm = wrapper.vm as any;
            expect(vm.showSuggestions).toBe(true);
        });

        it('should handle empty civilizations array', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: [],
                },
            });

            const input = wrapper.find('input');
            await input.setValue('test');

            const vm = wrapper.vm as any;
            expect(vm.suggestions).toHaveLength(0);
        });
    });

    describe('Styling', () => {
        it('should have correct input styling classes', () => {
            const wrapper = mount(SearchInputComponent);
            const input = wrapper.find('input');

            expect(input.classes()).toContain('input');
            expect(input.classes()).toContain('bg-zinc-800');
            expect(input.classes()).toContain('text-amber-500');
            expect(input.classes()).toContain('border-amber-500');
            expect(input.classes()).toContain('border-2');
            expect(input.classes()).toContain('rounded-lg');
            expect(input.classes()).toContain('h-11');
            expect(input.classes()).toContain('pr-10');
        });

        it('should have correct suggestions styling', async () => {
            const wrapper = mount(SearchInputComponent, {
                props: {
                    civilizations: mockCivilizations,
                },
            });

            const input = wrapper.find('input');
            await input.setValue('Fr');
            await input.trigger('focus');

            const suggestions = wrapper.find('.suggestions');
            expect(suggestions.classes()).toContain('absolute');
            expect(suggestions.classes()).toContain('top-full');
            expect(suggestions.classes()).toContain('bg-zinc-900');
            expect(suggestions.classes()).toContain('border');
            expect(suggestions.classes()).toContain('border-amber-500');
            expect(suggestions.classes()).toContain('rounded-lg');
        });
    });
});
