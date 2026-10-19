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

    it('keeps rendering when the category identifier is unknown', () => {
        const wrapper = mount(CivTagComponent, { props: { tag_id: 999 } });

        expect(wrapper.find('.civ-tag').exists()).toBe(true);
    });
});
