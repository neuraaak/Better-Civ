import { afterEach, describe, expect, it, beforeEach } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HeaderComponent from '@/components/layout/HeaderComponent.vue';
import { createTestRouter } from '../../utils/router';

enableAutoUnmount(afterEach);

describe('HeaderComponent', () => {
    let router: Awaited<ReturnType<typeof createTestRouter>>;

    beforeEach(async () => {
        setActivePinia(createPinia());
        router = await createTestRouter('/civilization-5');
    });

    it('renders the Better-Civ brand and language selector', () => {
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] } });

        expect(wrapper.find('header.header').exists()).toBe(true);
        expect(wrapper.find('.brand-title').text()).toBe('Better-Civ');
        expect(wrapper.find('.brand-accent').text()).toBe('Civ');
        expect(wrapper.find('.brand-subtitle').text()).toBe('Tier list · Méta actuelle');
        expect(wrapper.findComponent({ name: 'SelectLanguageComponent' }).exists()).toBe(true);
    });

    it('draws the hexagon logo inline with an accessible brand link', () => {
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] } });

        expect(wrapper.find('a.brand').attributes('aria-label')).toBe('Better-Civ');
        expect(wrapper.find('a.brand').attributes('href')).toBe('/');
        expect(wrapper.find('svg.brand-mark').attributes('aria-hidden')).toBe('true');
        expect(wrapper.findAll('svg.brand-mark path')).toHaveLength(3);
    });

    it('marks Civilization V as the current game and flags the other two as WIP', () => {
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] } });
        const links = wrapper.findAll('.game-nav .game-link');

        expect(wrapper.find('.game-nav').attributes('aria-label')).toBe('Jeux');
        expect(links.map(link => link.text())).toEqual([
            'VCivilization V',
            'VICivilization VI WIP',
            'VIICivilization VII WIP',
        ]);
        expect(links[0].attributes('aria-current')).toBe('page');
        expect(links[0].attributes('href')).toBe('/civilization-5');
        expect(links[0].find('.game-underline').exists()).toBe(true);
        links.slice(1).forEach((link, index) => {
            expect(link.classes()).toContain('locked');
            expect(link.attributes('href')).toBe(`/civilization-${index + 6}`);
            expect(link.attributes('title')).toBe('Bientôt disponible');
            expect(link.find('.game-wip').text()).toBe('WIP');
        });
    });

    it('renders the language selector and the meander rule below', () => {
        const wrapper = mount(HeaderComponent, { global: { plugins: [router] } });

        expect(wrapper.find('.language-selector').exists()).toBe(true);
        expect(wrapper.find('.header-rule.meander').exists()).toBe(true);
    });

    describe('mobile game menu', () => {
        it('opens and closes the game dropdown from its button', async () => {
            const wrapper = mount(HeaderComponent, { global: { plugins: [router] } });
            const toggle = wrapper.find('.game-menu-toggle');

            expect(toggle.attributes('aria-controls')).toBe('game-nav');
            expect(toggle.attributes('aria-label')).toBe('Jeux');
            expect(toggle.attributes('aria-expanded')).toBe('false');

            await toggle.trigger('click');
            expect(wrapper.find('.game-menu').classes()).toContain('open');
            expect(toggle.attributes('aria-expanded')).toBe('true');
            expect(toggle.find('.ph-x').exists()).toBe(true);

            await toggle.trigger('click');
            expect(wrapper.find('.game-menu').classes()).not.toContain('open');
            expect(toggle.find('.ph-list').exists()).toBe(true);
        });

        it('closes on Escape, on a click outside and after picking a game', async () => {
            const wrapper = mount(HeaderComponent, {
                attachTo: document.body,
                global: { plugins: [router] },
            });
            const menu = () => wrapper.find('.game-menu').classes();
            const open = () => wrapper.find('.game-menu-toggle').trigger('click');

            await open();
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await wrapper.vm.$nextTick();
            expect(menu()).not.toContain('open');

            await open();
            // onClickOutside skips clicks in the same tick as the opening one
            await new Promise(resolve => setTimeout(resolve));
            document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await wrapper.vm.$nextTick();
            expect(menu()).not.toContain('open');

            await open();
            await wrapper.find('.game-link').trigger('click');
            expect(menu()).not.toContain('open');
        });
    });
});
