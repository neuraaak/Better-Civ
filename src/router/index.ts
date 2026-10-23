/**
 * "/" lands on the home page, then one route per game: Civilization V has its
 * tier list, VI and VII their work in progress page. The 403 and the unknown
 * paths own their own page.
 */
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
    type RouterHistory,
} from 'vue-router';

// CONSTANTS
// ##############
const workInProgressView = () => import('../views/WorkInProgressView.vue');

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Better Civ' },
    },
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
        component: () => import('../views/ForbiddenView.vue'),
        meta: { title: 'Better Civ' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFoundView.vue'),
        meta: { title: 'Better Civ' },
    },
];

// FUNCTIONS
// ##############
/** Tests pass a memory history; the app uses the browser URL. */
export function createAppRouter(history: RouterHistory = createWebHistory()) {
    return createRouter({ history, routes });
}
