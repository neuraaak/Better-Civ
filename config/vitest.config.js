import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,vue}'],
            // Fail `test:coverage` if coverage regresses below these floors
            thresholds: {
                lines: 90,
                functions: 80,
                branches: 80,
                statements: 90,
            },
            exclude: [
                'src/main.ts',
                'node_modules/',
                'dist/',
                'tests/',
                '**/*.d.ts',
                '**/*.config.js',
                '**/*.config.ts',
                'coverage/',
                '.vscode/',
                '.cursor/',
                'public/',
            ],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src'),
        },
    },
});
