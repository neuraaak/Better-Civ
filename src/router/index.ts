/**
 * One route per game: Civilization V has its tier list, VI and VII their work in
 * progress page. The 403 and every unknown path share the status page, told
 * apart by `meta.status`.
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
const statusView = () => import('../views/StatusView.vue');
const workInProgressView = () => import('../views/WorkInProgressView.vue');

export const routes: RouteRecordRaw[] = [
    { path: '/', redirect: DEFAULT_GAME_PATH },
    {
        path: '/civilization-5',
        name: 'civilization-5',
        component: () => import('../views/Civ5TierListView.vue'),
        meta: { title: 'Better Civ5' },
    },
    {
        path: '/civilization-6',
        name: 'civilization-6',
        component: workInProgressView,
        meta: { title: 'Better Civ6' },
    },
    {
        path: '/civilization-7',
        name: 'civilization-7',
        component: workInProgressView,
        meta: { title: 'Better Civ7' },
    },
    {
        path: '/403',
        name: 'forbidden',
        component: statusView,
        meta: { title: 'Better Civ', status: 'forbidden' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: statusView,
        meta: { title: 'Better Civ', status: 'notFound' },
    },
];

// FUNCTIONS
// ##############
/** Tests pass a memory history; the app uses the browser URL. */
export function createAppRouter(history: RouterHistory = createWebHistory()) {
    return createRouter({ history, routes });
}
