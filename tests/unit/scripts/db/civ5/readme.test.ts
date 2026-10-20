import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('database importer documentation', () => {
    it('documents the Civ V build command and both generated artifacts', () => {
        const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8');

        expect(readme).toContain('pnpm db:build:civ5');
        expect(readme).toContain('civilization-5.sqlite');
        expect(readme).toContain('civilization-5.manifest.json');
    });
});
