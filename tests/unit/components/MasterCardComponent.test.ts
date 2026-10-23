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
        expect(wrapper.attributes('style')).toContain('oklch(0.62 0.08 50)');
        expect(wrapper.find('.panel-hero').exists()).toBe(true);
        expect(wrapper.find('.hero-name').text()).toBe('France');
        expect(wrapper.find('.hero-rank').text()).toContain('Tier D');
        // The history reads as a quotation: typographic marks around an italic text
        expect(wrapper.find('.civilization-description p').text()).toBe(
            'Une civilisation culturelle.'
        );
        expect(wrapper.findAll('.quote-mark').map(mark => mark.text())).toEqual(['“', '”']);
        expect(wrapper.find('.leader-name').text()).toBe('Catherine de Médicis');
        expect(wrapper.find('.panel-position').text()).toBe(props.position);
        expect(wrapper.find('.bar-frieze.frieze').exists()).toBe(true);
    });

    it('shows the civilization emblem in the hero medallion, tier badge pinned to it', () => {
        const wrapper = mount(MasterCardComponent, { props });
        const medallion = wrapper.find('.hero-medallion');

        expect(medallion.attributes('style')).toContain('--medallion-size: 96px');
        expect(medallion.find('.medallion-face img').attributes('src')).toBe('/img/france.png');
        expect(medallion.find('.medallion-badge').exists()).toBe(true);
        expect(medallion.find('.medallion-fallback').exists()).toBe(false);
    });

    it('falls back on a flag glyph for a civilization without an emblem', () => {
        const wrapper = mount(MasterCardComponent, {
            props: { ...props, civ: { ...civ, icon: undefined } },
        });

        expect(wrapper.find('.medallion-face img').exists()).toBe(false);
        expect(wrapper.find('.medallion-fallback').exists()).toBe(true);
    });

    it('lays out the sections of the handoff in order', () => {
        const wrapper = mount(MasterCardComponent, { props });

        expect(wrapper.find('.section-label').text()).toBe('Bonus de civilisation');
        const headings = wrapper.findAll('.section-heading').map(heading => heading.text());
        expect(headings).toEqual(['Dirigeant', 'Éléments uniques', 'Histoire']);
        expect(wrapper.find('.bonus-block strong').text()).toBe('Grand Tour');
        expect(wrapper.find('.bonus-block p').text()).toBe(
            'Obtient un niveau de visibilité diplomatique.'
        );
        expect(wrapper.find('.leader-subtitle').text()).toBe('Reine de France');
        expect(wrapper.find('.leader-text p').text()).toBe('Fille de Laurent II de Médicis.');
    });

    it('opens the unique elements on the first tab that has items', async () => {
        const wrapper = mount(MasterCardComponent, { props });

        const tabs = wrapper.findAll('.item-tab');
        expect(tabs.map(tab => tab.text())).toEqual(['Unités 1', 'Bâtiments 1', 'Améliorations 0']);
        expect(tabs[0].classes()).toContain('active');
        // The improvements tab is empty, so it cannot be picked
        expect(tabs[2].classes()).toContain('empty');
        expect(tabs[2].attributes('disabled')).toBeDefined();

        expect(wrapper.findAll('.unique-item')).toHaveLength(1);
        expect(wrapper.find('.item-title strong').text()).toBe('Garde impériale');

        await tabs[1].trigger('click');
        expect(wrapper.find('.item-title strong').text()).toBe('Château');
    });

    it('shows the stats, yields and collapsible strategy the database carries', async () => {
        const wrapper = mount(MasterCardComponent, {
            props: {
                ...props,
                civ: {
                    ...civ,
                    unique_units: [
                        {
                            name: 'Mousquetaire',
                            cost: 120,
                            movement: 2,
                            tech: 'Poudre à canon',
                            description: 'Fantassin à distance.',
                            strategy: 'Tenez les collines.',
                            yields: [{ type: 'culture', amount: 2 }],
                        },
                    ],
                },
            },
        });

        const stats = wrapper.findAll('.item-stat').map(stat => stat.text());
        expect(stats).toEqual(['Production120', 'Mouvement2', 'TechnologiePoudre à canon']);
        expect(wrapper.find('.item-chip').text()).toBe('+2 Culture');
        expect(wrapper.find('.item-description').text()).toBe('Fantassin à distance.');

        expect(wrapper.find('.item-strategy').exists()).toBe(false);
        await wrapper.find('.item-strategy-toggle').trigger('click');
        expect(wrapper.find('.item-strategy').text()).toBe('Tenez les collines.');
    });

    it('leaves out the strategy row of an item the database has no advice for', () => {
        const wrapper = mount(MasterCardComponent, {
            props: { ...props, civ: { ...civ, unique_units: [{ name: 'Garde' }] } },
        });

        expect(wrapper.find('.item-strategy-toggle').exists()).toBe(false);
        expect(wrapper.find('.item-stats').exists()).toBe(false);
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

        expect(wrapper.find('.item-title strong').text()).toBe('Minuteman');
    });

    it('hides the sections a civilization has no data for', () => {
        const wrapper = mount(MasterCardComponent, {
            props: { civ: { id: 2, name: 'Mod civ' } },
        });

        expect(wrapper.findAll('.section-label')).toHaveLength(0);
        expect(wrapper.findAll('.section-heading')).toHaveLength(0);
        expect(wrapper.find('.item-tabs').exists()).toBe(false);
        expect(wrapper.find('.panel-tags').exists()).toBe(false);
        expect(wrapper.find('.hero-name').text()).toBe('Mod civ');
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
