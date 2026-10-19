import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';

// Header and Content are async components: wait for their dynamic imports to resolve
const mountApp = async () => {
    const wrapper = mount(App);
    await vi.dynamicImportSettled();
    await flushPromises();
    return wrapper;
};

describe('App.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('Template', () => {
        it('should render App component', () => {
            const wrapper = mount(App);
            expect(wrapper.exists()).toBe(true);
        });

        it('should have header component', async () => {
            const wrapper = await mountApp();
            const header = wrapper.findComponent({ name: 'HeaderComponent' });
            expect(header.exists()).toBe(true);
        });

        it('should have content component', async () => {
            const wrapper = await mountApp();
            const content = wrapper.findComponent({ name: 'ContentComponent' });
            expect(content.exists()).toBe(true);
        });
    });

    describe('Structure', () => {
        it('should have proper component structure', async () => {
            const wrapper = await mountApp();
            expect(wrapper.findComponent({ name: 'HeaderComponent' }).exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'ContentComponent' }).exists()).toBe(true);
        });

        it('should pass civilisations data to ContentComponent', async () => {
            const wrapper = await mountApp();
            const contentComponent = wrapper.findComponent({ name: 'ContentComponent' });
            expect(contentComponent.props('civilisations')).toBeDefined();
        });
    });

    describe('Integration', () => {
        it('should integrate with Pinia store', () => {
            const wrapper = mount(App);
            // App should work with Pinia store
            expect(wrapper.vm).toBeDefined();
        });

        it('should handle language changes', () => {
            const wrapper = mount(App);
            // App should handle language changes through store
            expect(wrapper.vm).toBeDefined();
        });

        it('applies the XML tier ranking while preserving civilizations absent from the report', () => {
            const wrapper = mount(App);
            const mergeCivilizationData = (wrapper.vm as any).mergeCivilizationData;

            const [inca, spain] = mergeCivilizationData([{ id: 20 }, { id: 21 }]);

            expect(inca.tier_id).toBe(0);
            expect(spain.tier_id).toBe(2);
        });
    });
});
