import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HeaderComponent from '@/components/layout/HeaderComponent.vue';

describe('HeaderComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders the tier-list brand and language selector', () => {
        const wrapper = mount(HeaderComponent);

        expect(wrapper.find('header.header').exists()).toBe(true);
        expect(wrapper.find('.brand-title').text()).toBe('Tier List');
        expect(wrapper.find('.brand-subtitle').text()).toBe('Civilisations · Méta actuelle');
        expect(wrapper.findComponent({ name: 'SelectLanguageComponent' }).exists()).toBe(true);
    });

    it('uses an accessible product logo', () => {
        const wrapper = mount(HeaderComponent);
        const logo = wrapper.find('img.logo');

        expect(logo.attributes('src')).toBe('/img/logo.png');
        expect(logo.attributes('alt')).toBe('Logo Better-Civ');
    });

    it('renders the brand mark, language selector and the meander rule below', () => {
        const wrapper = mount(HeaderComponent);

        expect(wrapper.find('.brand-mark').exists()).toBe(true);
        expect(wrapper.find('.language-selector').exists()).toBe(true);
        expect(wrapper.find('.header-rule.meander').exists()).toBe(true);
    });
});
