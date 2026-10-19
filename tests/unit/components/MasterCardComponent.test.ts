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
        civ_trait_name: 'Grand Tour',
        civ_leader: 'Catherine de Médicis',
        civ_leader_subtitle: 'Reine de France',
        civ_leader_text: 'Fille de Laurent II de Médicis.',
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

    it('lays out the sections of the handoff in order', () => {
        const wrapper = mount(MasterCardComponent, { props });

        const labels = wrapper.findAll('.section-label').map(label => label.text());
        expect(labels).toEqual([
            'Bonus de civilisation',
            'Dirigeant',
            'Unités uniques',
            'Bâtiments uniques',
            'Histoire',
        ]);
        expect(wrapper.find('.bonus-block strong').text()).toBe('Grand Tour');
        expect(wrapper.find('.bonus-block p').text()).toBe(props.civ_leader_effect);
        expect(wrapper.find('.leader-subtitle').text()).toBe('Reine de France');
        expect(wrapper.find('.panel-rule.meander').exists()).toBe(true);
    });

    it('keeps the footer to the previous and next civilizations only', () => {
        const wrapper = mount(MasterCardComponent, { props });
        const footer = wrapper.find('.panel-navigation');

        expect(footer.findAll('button')).toHaveLength(2);
        expect(footer.find('.panel-position').exists()).toBe(false);
        expect(footer.text()).toContain('Allemagne');
        expect(footer.text()).toContain('Grèce');
    });

    it('drops the plural form of API names', () => {
        const wrapper = mount(MasterCardComponent, {
            props: { ...props, civ_units: [{ name: 'Minuteman|Minutemen' }] },
        });

        expect(wrapper.findAll('.unique-item')[0].text()).toBe('Minuteman');
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
