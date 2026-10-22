import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HeaderComponent from '@/components/layout/HeaderComponent.vue';

describe('HeaderComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the Better-Civ brand and language selector', () => {
        const wrapper = mount(HeaderComponent);

        expect(wrapper.find('header.header').exists()).toBe(true);
        expect(wrapper.find('.brand-title').text()).toBe('Better-Civ');
        expect(wrapper.find('.brand-accent').text()).toBe('Civ');
        expect(wrapper.find('.brand-subtitle').text()).toBe('Tier list · Méta actuelle');
        expect(wrapper.findComponent({ name: 'SelectLanguageComponent' }).exists()).toBe(true);
    });

    it('draws the hexagon logo inline with an accessible brand link', () => {
        const wrapper = mount(HeaderComponent);

        expect(wrapper.find('a.brand').attributes('aria-label')).toBe('Better-Civ');
        expect(wrapper.find('svg.brand-mark').attributes('aria-hidden')).toBe('true');
        expect(wrapper.findAll('svg.brand-mark path')).toHaveLength(3);
    });

    it('marks Civilization V as the current game and locks the other two', () => {
        const wrapper = mount(HeaderComponent);
        const links = wrapper.findAll('.game-nav .game-link');

        expect(wrapper.find('.game-nav').attributes('aria-label')).toBe('Jeux');
        expect(links.map(link => link.text())).toEqual([
            'VCivilization V',
            'VICivilization VI',
            'VIICivilization VII',
        ]);
        expect(links[0].attributes('aria-current')).toBe('page');
        expect(links[0].attributes('href')).toBe('/');
        expect(links[0].find('.game-underline').exists()).toBe(true);
        links.slice(1).forEach(link => {
            expect(link.attributes('aria-disabled')).toBe('true');
            expect(link.attributes('href')).toBeUndefined();
            expect(link.attributes('title')).toBe('Bientôt disponible');
            expect(link.find('.game-lock').exists()).toBe(true);
        });
    });

    it('renders the language selector and the meander rule below', () => {
        const wrapper = mount(HeaderComponent);

        expect(wrapper.find('.language-selector').exists()).toBe(true);
        expect(wrapper.find('.header-rule.meander').exists()).toBe(true);
    });
});
