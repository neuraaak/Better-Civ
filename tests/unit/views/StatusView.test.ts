import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import StatusView from '@/views/StatusView.vue';
import { createTestRouter } from '../../utils/router';

const mountAt = async (path: string) => {
    const router = await createTestRouter(path);
    return mount(StatusView, { global: { plugins: [router] } });
};

describe('StatusView.vue', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('shows the 404 copy on an unknown path', async () => {
        const wrapper = await mountAt('/nope');

        expect(wrapper.find('.eyebrow').text()).toBe('404');
        expect(wrapper.find('h1').text()).toBe('Page introuvable');
        expect(wrapper.find('.status-link').attributes('href')).toBe('/civilization-5');
    });

    it('shows the 403 copy', async () => {
        const wrapper = await mountAt('/403');

        expect(wrapper.find('.eyebrow').text()).toBe('403');
        expect(wrapper.find('h1').text()).toBe('Accès refusé');
    });
});
