import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivCardComponent from '@/components/civilisations/CivCardComponent.vue';
import { useAppStore } from '@/stores/app';
import type { TagId, TierId } from '@/data/taxonomy';

describe('CivCardComponent', () => {
    const mockCivilization = {
        id: 1,
        name: 'France|La France',
        tags_id: [1, 2] as TagId[],
        tier_id: 2 as TierId,
    };

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the compact portrait composition from the tier-list design', () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });

        const card = wrapper.find('article.portrait-card');
        expect(card.attributes('role')).toBe('button');
        expect(card.attributes('tabindex')).toBe('0');
        expect(wrapper.find('.card-visual').attributes('src')).toBe('/img/civ5-card-bg.webp');
        expect(wrapper.find('h2').text()).toBe('France');
        expect(card.attributes('aria-label')).toBe('Ouvrir les détails de France');
        expect(wrapper.findComponent({ name: 'CivTierComponent' }).exists()).toBe(true);
        expect(wrapper.findAllComponents({ name: 'CivTagComponent' })).toHaveLength(2);
    });

    it('names the rank and the leader under the centred badge', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, leader_name: 'Napoléon|Napoléons' },
        });

        expect(wrapper.find('.card-rank').text()).toBe('Royaume');
        expect(wrapper.find('.card-leader').text()).toBe('Napoléon');
        expect(wrapper.find('.card-medallion').exists()).toBe(true);
        expect(wrapper.find('.card-frieze').exists()).toBe(true);
        expect(wrapper.findAll('.card-flute')).toHaveLength(2);
        expect(wrapper.findAll('.card-rules i')).toHaveLength(3);
    });

    it('leaves the leader line out of a civilization without one', () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });

        expect(wrapper.find('.card-leader').exists()).toBe(false);
        expect(wrapper.find('.card-rank').exists()).toBe(true);
    });

    it('carries the civilization emblem in the medallion', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, icon: '/img/france.png' },
        });
        const medallion = wrapper.find('.card-medallion');

        expect(medallion.attributes('style')).toContain('--medallion-size: 62px');
        expect(medallion.find('.medallion-face img').attributes('src')).toBe('/img/france.png');
        expect(medallion.find('.medallion-fallback').exists()).toBe(false);
    });

    it('uses the tier palette for the card frame and its top accent', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, tier_id: 4 as TierId },
        });

        const style = wrapper.find('.portrait-card').attributes('style');
        expect(style).toContain('--tier-line: oklch(0.62 0.07 50)');
        expect(style).toContain(
            '--tier-frame: color-mix(in srgb, oklch(0.62 0.07 50) 24%, transparent)'
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

            const store = useAppStore();
            expect(store.selectedCivId).toBe(1);
            expect(store.detailOpen).toBe(true);
        }
    );

    it('keeps the details panel open after a second activation', async () => {
        const wrapper = mount(CivCardComponent, { props: mockCivilization });
        const card = wrapper.find('.portrait-card');

        await card.trigger('click');
        await card.trigger('click');

        expect(useAppStore().detailOpen).toBe(true);
    });

    it('renders the classic composition: visual on top, name, badge and tags below', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, variant: 'classic' },
        });

        const card = wrapper.find('article.classic-card');
        expect(card.exists()).toBe(true);
        expect(wrapper.find('.portrait-card').exists()).toBe(false);
        expect(card.find('.classic-media .card-visual').attributes('src')).toBe(
            '/img/civ5-card-bg.webp'
        );
        expect(card.find('.classic-title h2').text()).toBe('France');
        expect(
            card.find('.classic-title').findComponent({ name: 'CivTierComponent' }).props('size')
        ).toBe(32);
        const tags = wrapper.findAllComponents({ name: 'CivTagComponent' });
        expect(tags.map(tag => tag.props('variant'))).toEqual(['classic', 'classic']);
    });

    it('opens the details panel from a classic card', async () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, variant: 'classic' },
        });

        await wrapper.find('.classic-card').trigger('click');

        expect(useAppStore().selectedCivId).toBe(1);
    });

    it('supports a civilization without categories', () => {
        const wrapper = mount(CivCardComponent, {
            props: { ...mockCivilization, tags_id: [] },
        });

        expect(wrapper.find('.card-tags').exists()).toBe(false);
    });
});
