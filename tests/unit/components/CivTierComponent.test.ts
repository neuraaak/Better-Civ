import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivTierComponent from '@/components/civilisations/subcomponents/CivTierComponent.vue';

describe('CivTierComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the animated prism badge for tier S', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 0 } });

        expect(wrapper.find('.tier-badge.tier-s').exists()).toBe(true);
        expect(wrapper.find('.tier-badge').text()).toBe('S');
    });

    it.each([
        [1, 'a', 'A'],
        [2, 'b', 'B'],
        [3, 'c', 'C'],
        [4, 'd', 'D'],
    ])('renders the %s badge', (tierId, tierClass, letter) => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: tierId } });

        expect(wrapper.find(`.tier-badge.tier-${tierClass}`).exists()).toBe(true);
        expect(wrapper.find('.tier-badge').text()).toBe(letter);
    });

    it('falls back to the D badge for an unknown tier', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 999 } });

        expect(wrapper.find('.tier-badge.tier-d').exists()).toBe(true);
    });
});
