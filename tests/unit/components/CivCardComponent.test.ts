import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivCardComponent from '@/components/civilisations/CivCardComponent.vue';

describe('CivCardComponent', () => {
    const mockCivilization = {
        id: 1,
        name: 'France|La France',
        desc: 'A cultural civilization with unique units and buildings',
        tags_id: [1, 2],
        tier_id: 2,
        civ_leader_effect: 'Gain +2 Culture from each [CULTURE] building',
    };

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the compact portrait composition from the tier-list design', () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });

        const card = wrapper.find('article.portrait-card');
        expect(card.attributes('role')).toBe('button');
        expect(card.attributes('tabindex')).toBe('0');
        expect(wrapper.find('.card-visual').attributes('src')).toBe('/img/card-cover2.jpg');
        expect(wrapper.find('h2').text()).toBe('France');
        expect(wrapper.findComponent({ name: 'CivTierComponent' }).exists()).toBe(true);
        expect(wrapper.findAllComponents({ name: 'CivTagComponent' })).toHaveLength(2);
    });

    it('keeps detailed civilization data out of the card', () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });

        expect(wrapper.find('.card-summary').exists()).toBe(false);
        expect(wrapper.find('#leader').exists()).toBe(false);
        expect(wrapper.text()).not.toContain(mockCivilization.desc);
        expect(wrapper.text()).not.toContain(mockCivilization.civ_leader_effect);
    });

    it('uses the tier palette for the card frame and its top accent', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, tier_id: 4 },
        });

        const style = wrapper.find('.portrait-card').attributes('style');
        expect(style).toContain('--tier-line: oklch(0.62 0.08 50)');
        expect(style).toContain(
            '--tier-frame: color-mix(in srgb, oklch(0.62 0.08 50) 22%, transparent)'
        );
    });

    it('highlights the card whose details are open', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, selected: true },
        });

        const card = wrapper.find('.portrait-card');
        expect(card.classes()).toContain('selected');
        expect(card.attributes('aria-pressed')).toBe('true');
    });

    it.each(['click', 'keydown.enter', 'keydown.space'])(
        'opens the details panel on %s',
        async event => {
            const wrapper = mount(CivCardComponent, { props: mockCivilization });
            const card = wrapper.find('.portrait-card');

            await card.trigger(event);

            const vm = wrapper.vm as any;
            expect(vm.selectedCard).toBe(1);
            expect(vm.selectedState).toBe(true);
        }
    );

    it('keeps the details panel open after a second activation', async () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });
        const card = wrapper.find('.portrait-card');

        await card.trigger('click');
        await card.trigger('click');

        expect((wrapper.vm as any).selectedState).toBe(true);
    });

    it('supports a civilization without categories', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, tags_id: [] },
        });

        expect(wrapper.find('.card-tags').exists()).toBe(false);
    });
});
