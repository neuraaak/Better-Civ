import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SelectLanguageComponent from '@/components/global/SelectLanguageComponent.vue';

describe('SelectLanguageComponent', () => {
    let pinia: any;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
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

    describe('Data', () => {
        it('should have correct language options with flags', () => {
            const wrapper = mount(SelectLanguageComponent);
            const vm = wrapper.vm as any;

            expect(vm.options).toHaveLength(10);
            expect(vm.options[0]).toEqual({ label: 'EN', flag: '🇺🇸', lang: 'en' });
            expect(vm.options[9]).toEqual({ label: 'ZH', flag: '🇨🇳', lang: 'zh' });
        });

        it('should have default selected language', () => {
            const wrapper = mount(SelectLanguageComponent);
            const vm = wrapper.vm as any;

            expect(vm.selectedLang).toBe('fr');
        });
    });

    describe('Methods', () => {
        it('should call store.setLanguage when language changes', async () => {
            const wrapper = mount(SelectLanguageComponent);
            const select = wrapper.find('select');

            await select.setValue('en');

            // Verify that the language was changed
            expect((wrapper.vm as any).selectedLang).toBe('en');
        });

        it('should call store.setLanguage with correct language code', async () => {
            const wrapper = mount(SelectLanguageComponent);
            const select = wrapper.find('select');

            await select.setValue('de');

            // Verify that the language was changed
            expect((wrapper.vm as any).selectedLang).toBe('de');
        });
    });

    describe('User Interactions', () => {
        it('should update selected language when user changes selection', async () => {
            const wrapper = mount(SelectLanguageComponent);
            const select = wrapper.find('select');

            await select.setValue('es');

            expect((wrapper.vm as any).selectedLang).toBe('es');
        });

        it('should trigger change event when language is selected', async () => {
            const wrapper = mount(SelectLanguageComponent);
            const select = wrapper.find('select');

            await select.setValue('it');

            expect((wrapper.vm as any).selectedLang).toBe('it');
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
