import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import NotFoundView from '@/views/NotFoundView.vue';
import { createTestRouter } from '../../utils/router';

const mountAt = async (path = '/nope/deep') => {
    const router = await createTestRouter(path);
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } });
    return Object.assign(wrapper, { router });
};

describe('NotFoundView.vue', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('shows the 404 copy, the Roman code and the way back', async () => {
        const wrapper = await mountAt();

        expect(wrapper.find('.eyebrow').text()).toBe('Erreur 404');
        // 404 in Roman numerals
        expect(wrapper.find('.code').text()).toBe('CDIV');
        expect(wrapper.find('h1').text()).toBe('Terre inexplorée');
        expect(wrapper.find('.lede').text()).toContain('brouillard de guerre');
        expect(wrapper.find('.action.primary').attributes('href')).toBe('/civilization-5');
        expect(wrapper.find('button.action').text()).toBe('Page précédente');
    });

    it('draws the hex map with the missing tile at its centre', async () => {
        const wrapper = await mountAt();

        // 11 columns × 8 rows, one of them carrying the question mark
        expect(wrapper.findAll('.hex')).toHaveLength(88);
        expect(wrapper.findAll('.hex .ph-question')).toHaveLength(1);
        expect(wrapper.findAll('.ping-ring')).toHaveLength(2);
    });

    it('goes back when there is history, and to the tier list otherwise', async () => {
        const wrapper = await mountAt();
        const back = vi.spyOn(wrapper.router, 'back').mockImplementation(() => {});
        const push = vi.spyOn(wrapper.router, 'push');

        vi.spyOn(window.history, 'length', 'get').mockReturnValue(3);
        await wrapper.find('button.action').trigger('click');
        expect(back).toHaveBeenCalled();

        vi.spyOn(window.history, 'length', 'get').mockReturnValue(1);
        await wrapper.find('button.action').trigger('click');
        expect(push).toHaveBeenCalledWith('/civilization-5');

        vi.restoreAllMocks();
    });
});
