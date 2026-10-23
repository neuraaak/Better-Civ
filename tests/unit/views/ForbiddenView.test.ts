import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ForbiddenView from '@/views/ForbiddenView.vue';
import { createTestRouter } from '../../utils/router';

const mountAt = async (path: string) => {
    const router = await createTestRouter(path);
    return mount(ForbiddenView, { global: { plugins: [router] } });
};

describe('ForbiddenView.vue', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('shows the 403 copy and links back to the tier list', async () => {
        const wrapper = await mountAt('/403');

        expect(wrapper.find('.eyebrow').text()).toBe('403');
        expect(wrapper.find('h1').text()).toBe('Accès refusé');
        expect(wrapper.find('.status-link').attributes('href')).toBe('/civilization-5');
    });
});
