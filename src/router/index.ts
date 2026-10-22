/**
 * One route per game. "/" and unknown paths fall back to the default game;
 * Civilization VI and VII get their route once their tier list exists.
 */
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
    type RouterHistory,
} from 'vue-router';
import { DEFAULT_GAME_PATH } from '../data/games';

// CONSTANTS
// ##############
export const routes: RouteRecordRaw[] = [
    { path: '/', redirect: DEFAULT_GAME_PATH },
    {
        path: '/civilization-5',
        name: 'civilization-5',
        component: () => import('../views/Civ5TierListView.vue'),
        meta: { title: 'Better Civ5' },
    },
    { path: '/:pathMatch(.*)*', redirect: DEFAULT_GAME_PATH },
];

// FUNCTIONS
// ##############
/** Tests pass a memory history; the app uses the browser URL. */
export function createAppRouter(history: RouterHistory = createWebHistory()) {
    return createRouter({ history, routes });
}
