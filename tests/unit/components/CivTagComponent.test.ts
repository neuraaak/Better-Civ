import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CivTagComponent from '@/components/civilisations/subcomponents/CivTagComponent.vue';

describe('CivTagComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders a subdued dark tag with its category dot', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 1 } });

        expect(wrapper.find('.civ-tag').exists()).toBe(true);
        expect(wrapper.find('.category-dot').exists()).toBe(true);
        expect(wrapper.find('.civ-tag').text()).not.toBe('');
    });

    it('colours the dot with its category colour', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 4 } });

        expect(wrapper.find('.civ-tag').attributes('style')).toContain('oklch(0.70 0.13 25)');
    });

    it('offers the larger panel variant', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 1, variant: 'panel' } });

        expect(wrapper.find('.civ-tag').classes()).toContain('civ-tag-panel');
    });
});
