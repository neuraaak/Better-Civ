import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import WorkInProgressView from '@/views/WorkInProgressView.vue';
import { GAMES } from '@/data/games';
import { createTestRouter } from '../../utils/router';

const mountAt = async (path: string) => {
    const router = await createTestRouter(path);
    return mount(WorkInProgressView, { global: { plugins: [router] } });
};

const stageStates = (wrapper: Awaited<ReturnType<typeof mountAt>>) =>
    wrapper.findAll('.stage-dot').map(dot => dot.classes().find(name => name !== 'stage-dot'));

describe('WorkInProgressView.vue', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('shows the research of Civilization VI at its stage', async () => {
        const wrapper = await mountAt('/civilization-6');
        const research = GAMES.find(game => game.numeral === 'VI')?.research;

        expect(wrapper.find('.watermark').text()).toBe('VI');
        expect(wrapper.find('.eyebrow').text()).toBe('Civilization VI · Recherche en cours');
        expect(wrapper.find('.research-title').text()).toBe('Tier list Civilization VI');
        // 8 turns left, in Roman numerals
        expect(wrapper.find('.turns').text()).toBe('VIII');
        expect(wrapper.find('.bar-fill').attributes('style')).toContain('width: 64%');
        expect(wrapper.find('.bar').attributes('aria-valuenow')).toBe('64');
        // Stage 2 of 4 is running, the two before it are done
        expect(stageStates(wrapper)).toEqual(['done', 'done', 'current', 'todo']);
        expect(wrapper.findAll('.stage-key')[2].text()).toBe('En cours');
        expect(wrapper.findAll('.stage-key')[0].text()).toBe('Terminé');
        // One ghost card per entry of the research, one row per tier
        expect(wrapper.findAll('.ghost-row')).toHaveLength(5);
        expect(wrapper.findAll('.ghost-card')).toHaveLength(
            research?.ghost.reduce((a, b) => a + b, 0) ?? 0
        );
    });

    it('shows the Civilization VII copy and links back to the ranked game', async () => {
        const wrapper = await mountAt('/civilization-7');

        expect(wrapper.find('.watermark').text()).toBe('VII');
        expect(wrapper.find('.lede').text()).toContain('âge par âge');
        expect(wrapper.find('.preview-sub').text()).toBe(
            'Disponible à la publication · XXIV tours'
        );
        expect(wrapper.find('.back').text()).toBe('En attendant, voir la tier list Civilization V');
        expect(wrapper.find('.back').attributes('href')).toBe('/civilization-5');
        expect(stageStates(wrapper)).toEqual(['current', 'todo', 'todo', 'todo']);
    });
});
