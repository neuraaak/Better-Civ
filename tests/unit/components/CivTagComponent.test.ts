import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivTagComponent from '@/components/civilisations/subcomponents/CivTagComponent.vue';

describe('CivTagComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders a subdued dark tag with its category icon', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 1 } });

        expect(wrapper.find('.civ-tag').classes()).toContain('civ-tag-card');
        expect(wrapper.find('.category-icon').classes()).toContain('ph-mask-happy');
        expect(wrapper.find('.civ-tag').text()).toBe('Culture');
    });

    it('colours the icon with its category colour', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 4 } });

        expect(wrapper.find('.civ-tag').attributes('style')).toContain('oklch(0.70 0.13 25)');
        expect(wrapper.find('.category-icon').classes()).toContain('ph-sword');
    });

    it.each(['classic', 'panel'] as const)('offers the %s variant', variant => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 1, variant } });

        expect(wrapper.find('.civ-tag').classes()).toContain(`civ-tag-${variant}`);
    });
});
