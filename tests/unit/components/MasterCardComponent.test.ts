import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MasterCardComponent from '@/components/civilisations/MasterCardComponent.vue';
import type { Civilization } from '@/types';

describe('MasterCardComponent', () => {
    const civ: Civilization = {
        id: 1,
        name: 'France|La France',
        icon: '/img/france.png',
        tags_id: [1, 2],
        tier_id: 4,
        historical_info: [{ text: 'Une civilisation culturelle.' }],
        leader: {
            name: 'Catherine de Médicis',
            subtitle: 'Reine de France',
            icon: '/img/catherine.png',
            trait: {
                name: 'Grand Tour',
                effect: 'Obtient un niveau de visibilité diplomatique.',
            },
            historical_info: [{ text: 'Fille de Laurent II de Médicis.' }],
        },
        unique_units: [{ name: 'Garde impériale', icon: '/img/unit.png' }],
        unique_buildings: [{ name: 'Château', icon: '/img/building.png' }],
    };
    const props = { civ, position: 'I / II', previous_name: 'Allemagne', next_name: 'Grèce' };

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
        expect(wrapper.find('.civilization-description').text()).toBe(
            'Une civilisation culturelle.'
        );
        expect(wrapper.find('.leader-name').text()).toBe('Catherine de Médicis');
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
        expect(wrapper.find('.bonus-block p').text()).toBe(
            'Obtient un niveau de visibilité diplomatique.'
        );
        expect(wrapper.find('.leader-subtitle').text()).toBe('Reine de France');
        expect(wrapper.find('.leader-text p').text()).toBe('Fille de Laurent II de Médicis.');
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
            props: { ...props, civ: { ...civ, unique_units: [{ name: 'Minuteman|Minutemen' }] } },
        });

        expect(wrapper.findAll('.unique-item')[0].text()).toBe('Minuteman');
    });

    it('hides the sections a civilization has no data for', () => {
        const wrapper = mount(MasterCardComponent, {
            props: { civ: { id: 2, name: 'Mod civ' } },
        });

        expect(wrapper.findAll('.section-label')).toHaveLength(0);
        expect(wrapper.find('.panel-tags').exists()).toBe(false);
        expect(wrapper.find('.panel-name').text()).toBe('Mod civ');
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

    describe('touch gestures', () => {
        function swipe(element: Element, from: [number, number], to: [number, number]) {
            const touchEvent = (type: string, [clientX, clientY]: [number, number]) => {
                const event = new Event(type);
                Object.defineProperty(event, 'touches', { value: [{ clientX, clientY }] });
                element.dispatchEvent(event);
            };
            touchEvent('touchstart', from);
            touchEvent('touchmove', to);
            element.dispatchEvent(new Event('touchend'));
        }

        // The touch listeners attach once the panel element is rendered
        async function mountPanel() {
            const wrapper = mount(MasterCardComponent, { props });
            await wrapper.vm.$nextTick();
            return wrapper;
        }

        it('steps to the next and previous civilizations on a sideways swipe', async () => {
            const wrapper = await mountPanel();

            swipe(wrapper.element, [300, 200], [150, 210]);
            expect(wrapper.emitted('next')).toHaveLength(1);
            swipe(wrapper.element, [100, 200], [260, 190]);
            expect(wrapper.emitted('previous')).toHaveLength(1);
        });

        it('closes on a swipe down from the top only', async () => {
            const wrapper = await mountPanel();
            const scroller = wrapper.find('.panel-scroll').element;

            scroller.scrollTop = 120;
            swipe(wrapper.element, [200, 100], [200, 300]);
            expect(wrapper.emitted('close')).toBeUndefined();

            scroller.scrollTop = 0;
            swipe(wrapper.element, [200, 100], [200, 300]);
            expect(wrapper.emitted('close')).toHaveLength(1);
        });

        it('ignores short moves and swipes up', async () => {
            const wrapper = await mountPanel();

            swipe(wrapper.element, [200, 200], [170, 200]);
            swipe(wrapper.element, [200, 300], [200, 100]);
            expect(wrapper.emitted('next')).toBeUndefined();
            expect(wrapper.emitted('previous')).toBeUndefined();
            expect(wrapper.emitted('close')).toBeUndefined();
        });
    });
});
