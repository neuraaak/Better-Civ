import { createMemoryHistory } from 'vue-router';
import { createAppRouter } from '@/router';

/** App router on an in-memory history, already resolved on `path`. */
export async function createTestRouter(path = '/') {
    const router = createAppRouter(createMemoryHistory());
    await router.push(path);
    await router.isReady();
    return router;
}
