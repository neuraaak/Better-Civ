import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SelectLanguageComponent from '@/components/global/SelectLanguageComponent.vue';
import { useAppStore } from '@/stores/app';

describe('SelectLanguageComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('Template', () => {
        it('should render language selector', () => {
            const wrapper = mount(SelectLanguageComponent);

            expect(wrapper.find('select').exists()).toBe(true);
            expect(wrapper.find('.language-select').exists()).toBe(true);
            expect(wrapper.find('.language-current').text()).toBe('FR');
        });

        it('should render all language options', () => {
            const wrapper = mount(SelectLanguageComponent);
            const options = wrapper.findAll('option');

            const expectedLanguages = ['en', 'de', 'es', 'fr', 'it', 'jp', 'kr', 'pl', 'ru', 'zh'];
            expect(options).toHaveLength(expectedLanguages.length);

            expectedLanguages.forEach((lang, index) => {
                expect(options[index].attributes('value')).toBe(lang);
            });
        });

        it('should display correct language codes with flags', () => {
            const wrapper = mount(SelectLanguageComponent);
            const options = wrapper.findAll('option');

            const expectedValues = [
                'EN 🇺🇸',
                'DE 🇩🇪',
                'ES 🇪🇸',
                'FR 🇫🇷',
                'IT 🇮🇹',
                'JP 🇯🇵',
                'KR 🇰🇷',
                'PL 🇵🇱',
                'RU 🇷🇺',
                'ZH 🇨🇳',
            ];
            expectedValues.forEach((value, index) => {
                expect(options[index].text()).toBe(value);
            });
        });
    });

    describe('Language change', () => {
        it('updates the store language when the user picks one', async () => {
            const wrapper = mount(SelectLanguageComponent);

            await wrapper.find('select').setValue('de');

            expect(useAppStore().lang).toBe('de');
        });

        it('reflects a language set elsewhere in the store', async () => {
            const wrapper = mount(SelectLanguageComponent);

            useAppStore().setLanguage('ru');
            await wrapper.vm.$nextTick();

            expect(wrapper.find('select').element.value).toBe('ru');
            expect(wrapper.find('.language-current').text()).toBe('RU');
        });
    });

    describe('Ghost button', () => {
        it('shows the current language code with globe and caret icons', async () => {
            const wrapper = mount(SelectLanguageComponent);

            expect(wrapper.find('.ph-globe-simple').exists()).toBe(true);
            expect(wrapper.find('.ph-caret-down').exists()).toBe(true);

            await wrapper.find('select').setValue('de');
            expect(wrapper.find('.language-current').text()).toBe('DE');
        });

        it('keeps the native select accessible', () => {
            const wrapper = mount(SelectLanguageComponent);

            expect(wrapper.find('select').attributes('aria-label')).toBe('Langue');
        });
    });
});
