import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HomeView from '@/views/HomeView.vue';
import { createTestRouter } from '../../utils/router';

const mountHome = async () => {
    const router = await createTestRouter('/');
    return mount(HomeView, { global: { plugins: [router] } });
};

describe('HomeView.vue', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('renders the hero and the footer notice', async () => {
        const wrapper = await mountHome();

        expect(wrapper.find('.eyebrow').text()).toBe('Trois jeux · Une seule question');
        expect(wrapper.find('h1').text()).toContain('Quelle ère');
        expect(wrapper.find('h1 .accent').text()).toBe('allez-vous dominer ?');
        expect(wrapper.find('.section-rule h2').text()).toBe('Choisir un jeu');
        expect(wrapper.find('.home-footer').text()).toContain('non affilié à Firaxis');
    });

    it('lays out one card per game, in era order', async () => {
        const wrapper = await mountHome();
        const cards = wrapper.findAll('.card');

        expect(cards).toHaveLength(3);
        expect(cards.map(card => card.attributes('href'))).toEqual([
            '/civilization-5',
            '/civilization-6',
            '/civilization-7',
        ]);
        expect(cards.map(card => card.find('.numeral').text())).toEqual(['V', 'VI', 'VII']);
        expect(cards.map(card => card.find('.year').text())).toEqual(['2010', '2016', '2025']);
        expect(cards.map(card => card.find('.era').text())).toEqual([
            'Antiquité',
            'Moyen Âge',
            'Ère moderne',
        ]);
        expect(cards.map(card => card.classes()).map(names => names[1])).toEqual([
            'card-v',
            'card-vi',
            'card-vii',
        ]);
        // One lit pip per era reached
        expect(cards.map(card => card.findAll('.pip.lit').length)).toEqual([1, 2, 3]);
    });

    it('marks the ranked game as available and the others as coming', async () => {
        const wrapper = await mountHome();
        const cards = wrapper.findAll('.card');

        expect(cards[0].find('.tag').text()).toBe('Disponible');
        expect(cards[0].find('.tag').classes()).toContain('live');
        expect(cards[0].find('.cta').text()).toBe('Voir la tier list');

        expect(cards[1].find('.tag').text()).toBe('Bientôt');
        expect(cards[1].find('.tag').classes()).not.toContain('live');
        expect(cards[1].find('.cta').text()).toBe('En préparation');
    });
});
