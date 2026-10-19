import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('App Integration', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('App Structure', () => {
        it('should have proper file structure', () => {
            // Check if main files exist
            const appPath = path.resolve(__dirname, '../../src/App.vue');
            const mainPath = path.resolve(__dirname, '../../src/main.ts');

            expect(fs.existsSync(appPath)).toBe(true);
            expect(fs.existsSync(mainPath)).toBe(true);
        });

        it('should have proper Vue component structure', () => {
            const appPath = path.resolve(__dirname, '../../src/App.vue');
            const appContent = fs.readFileSync(appPath, 'utf8');

            expect(appContent).toContain('<template>');
            expect(appContent).toContain('<script');
        });

        it('should have store integration', () => {
            const storePath = path.resolve(__dirname, '../../src/stores/index.ts');
            const storeContent = fs.readFileSync(storePath, 'utf8');

            expect(storeContent).toContain('defineStore');
            expect(storeContent).toContain('translationStore');
        });
    });

    describe('Component Structure', () => {
        it('should have global components', () => {
            const globalComponentsPath = path.resolve(__dirname, '../../src/components/global');
            const files = fs.readdirSync(globalComponentsPath);

            expect(files.length).toBeGreaterThan(0);
            expect(files.some((file: string) => file.includes('SelectLanguage'))).toBe(true);
        });

        it('should have layout components', () => {
            const layoutComponentsPath = path.resolve(__dirname, '../../src/components/layout');
            const files = fs.readdirSync(layoutComponentsPath);

            expect(files.length).toBeGreaterThan(0);
            expect(files.some((file: string) => file.includes('Header'))).toBe(true);
            expect(files.some((file: string) => file.includes('Content'))).toBe(true);
        });

        it('should have civilization components', () => {
            const civComponentsPath = path.resolve(__dirname, '../../src/components/civilisations');
            const files = fs.readdirSync(civComponentsPath);

            expect(files.length).toBeGreaterThan(0);
            expect(files.some((file: string) => file.includes('CivCard'))).toBe(true);
            expect(files.some((file: string) => file.includes('MasterCard'))).toBe(true);
        });
    });

    describe('Type Definitions', () => {
        it('should have proper TypeScript types', () => {
            const typesPath = path.resolve(__dirname, '../../src/types/index.ts');
            const typesContent = fs.readFileSync(typesPath, 'utf8');

            expect(typesContent).toContain('interface Translation');
            expect(typesContent).toContain('interface Civilization');
            expect(typesContent).toContain('interface StoreState');
        });
    });

    describe('Configuration', () => {
        it('should have proper Vite configuration', () => {
            const viteConfigPath = path.resolve(__dirname, '../../config/vite.config.js');
            const viteContent = fs.readFileSync(viteConfigPath, 'utf8');

            expect(viteContent).toContain('defineConfig');
            expect(viteContent).toContain('vue()');
        });

        it('should have proper test configuration', () => {
            const vitestConfigPath = path.resolve(__dirname, '../../config/vitest.config.js');
            const vitestContent = fs.readFileSync(vitestConfigPath, 'utf8');

            expect(vitestContent).toContain('defineConfig');
            expect(vitestContent).toContain('jsdom');
        });
    });
});
