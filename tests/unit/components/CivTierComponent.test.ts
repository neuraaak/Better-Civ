import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivTierComponent from '@/components/civilisations/subcomponents/CivTierComponent.vue';

describe('CivTierComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the laurelled legend coin for tier S', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 0 } });

        expect(wrapper.find('.tier-badge.tier-s').exists()).toBe(true);
        expect(wrapper.find('.tier-badge').text()).toBe('S');
        // Two symmetric arcs of sixteen leaves, rotating greek-key band
        expect(wrapper.findAll('.tier-laurel ellipse')).toHaveLength(32);
        expect(wrapper.find('.tier-ornament').classes()).toContain('key');
        expect(wrapper.find('.tier-badge').attributes('style')).toContain('dc-spin 30s');
    });

    it.each([
        [1, 'key'],
        [2, 'beads'],
        [3, 'ring'],
    ] as const)('strikes the coin of tier id %s with its %s band', (tierId, ornament) => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: tierId } });

        expect(wrapper.find('.tier-ornament').classes()).toContain(ornament);
        expect(wrapper.find('.tier-laurel').exists()).toBe(false);
    });

    it('leaves the lowest coin plain, with neither band nor laurel', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 4 } });

        expect(wrapper.find('.tier-ornament').exists()).toBe(false);
        expect(wrapper.find('.tier-laurel').exists()).toBe(false);
        expect(wrapper.find('.tier-rim').exists()).toBe(true);
        expect(wrapper.find('.tier-face').exists()).toBe(true);
    });

    it.each([
        [1, 'a', 'A'],
        [2, 'b', 'B'],
        [3, 'c', 'C'],
        [4, 'd', 'D'],
    ] as const)('renders the %s badge', (tierId, tierClass, letter) => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: tierId } });

        expect(wrapper.find(`.tier-badge.tier-${tierClass}`).exists()).toBe(true);
        expect(wrapper.find('.tier-badge').text()).toBe(letter);
    });

    it('labels the badge with its tier and rank', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 1 } });

        expect(wrapper.find('.tier-badge').attributes('title')).toBe('Tier A · Empire');
    });

    it('sizes the badge and its letter from the design scale', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 0, size: 58 } });
        const style = wrapper.find('.tier-badge').attributes('style');

        expect(style).toContain('--tier-size: 58px');
        expect(style).toContain('--tier-font: 24px');
    });

    it('dims the badge on request', () => {
        const wrapper = mount(CivTierComponent, { props: { tier_id: 2, dimmed: true } });

        expect(wrapper.find('.tier-badge').attributes('style')).toContain('opacity: 0.4');
    });

    it('falls back to the D badge for an unrated civilization', () => {
        const wrapper = mount(CivTierComponent);

        expect(wrapper.find('.tier-badge.tier-d').exists()).toBe(true);
    });
});
