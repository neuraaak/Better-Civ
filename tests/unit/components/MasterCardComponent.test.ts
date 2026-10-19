import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MasterCardComponent from '@/components/civilisations/MasterCardComponent.vue';

describe('MasterCardComponent', () => {
    const props = {
        id: 1,
        name: 'France|La France',
        desc: 'Une civilisation culturelle.',
        tags_id: [1, 2],
        tier_id: 4,
        civ_icon: '/img/france.png',
        civ_leader: 'Catherine de Médicis',
        civ_leader_icon: '/img/catherine.png',
        civ_leader_effect: 'Obtient un niveau de visibilité diplomatique.',
        civ_units: [{ name: 'Garde impériale', icon: '/img/unit.png' }],
        civ_building: [{ name: 'Château', icon: '/img/building.png' }],
        position: 'I / II',
        previous_name: 'Allemagne',
        next_name: 'Grèce',
    };

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the handoff detail-panel structure from available civilization data', () => {
        const wrapper = mount(MasterCardComponent, { props });

        expect(wrapper.find('article.civilization-panel').exists()).toBe(true);
        expect(wrapper.find('.panel-accent').attributes('style')).toContain('oklch(0.62 0.08 50)');
        expect(wrapper.find('.panel-hero').exists()).toBe(true);
        expect(wrapper.find('.panel-name').text()).toBe('France');
        expect(wrapper.find('.tier-meta').text()).toContain('TIER D');
        expect(wrapper.find('.civilization-description').text()).toBe(props.desc);
        expect(wrapper.find('.leader-name').text()).toBe(props.civ_leader);
        expect(wrapper.findAll('.unique-item')).toHaveLength(2);
        expect(wrapper.find('.panel-position').text()).toBe(props.position);
    });

    it('emits close and navigation events from panel controls', async () => {
        const wrapper = mount(MasterCardComponent, { props });

        await wrapper.find('.panel-close').trigger('click');
        await wrapper.find('.panel-previous').trigger('click');
        await wrapper.find('.panel-next').trigger('click');

        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(wrapper.emitted('previous')).toHaveLength(1);
        expect(wrapper.emitted('next')).toHaveLength(1);
    });
});
