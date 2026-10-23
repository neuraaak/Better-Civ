import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createStagingDatabase } from '../../../../../.scripts/db/civ5/database';
import { normalizeResource } from '../../../../../.scripts/db/civ5/lib/normalize';
import {
    readStagedResources,
    stageResources,
    validateStagingCoverage,
} from '../../../../../.scripts/db/civ5/lib/staging';
import { CIV5_LANGUAGES } from '../../../../../.scripts/db/civ5/constants';
import type { NormalizedResource } from '../../../../../.scripts/db/civ5/types';

const directories: string[] = [];

afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true })));

describe('staging resources', () => {
    it('stores canonical CivVAPI documents deterministically with source metadata', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-staging-'));
        directories.push(directory);
        const database = createStagingDatabase(join(directory, 'staging.sqlite'));
        const wonder = normalizeResource('wonders', 'fr', { id: 48, name: 'Cirque Maxime' });
        const promotion = normalizeResource('promotions', 'en', {
            id: 17,
            name: 'Accuracy I',
            url: 'https://eyefyre.github.io/civvapi/v1/en/promotions/bonus_vs_aircraft/accuracy_i.json',
        });

        stageResources(database, [promotion, wonder]);

        expect(readStagedResources(database)).toEqual([
            expect.objectContaining({
                kind: 'promotions',
                resourceKey: 'promotions/bonus_vs_aircraft/accuracy_i',
                sourceId: 17,
                payload: promotion.payload,
            }),
            expect.objectContaining({
                kind: 'wonders',
                resourceKey: 'wonders/id-48',
                sourceId: 48,
                sourceUrl: 'https://eyefyre.github.io/civvapi/v1/fr/wonders/id-48.json',
                payload: wonder.payload,
            }),
        ]);
        database.close();
    });

    it.each<[string, (resources: NormalizedResource[]) => NormalizedResource[]]>([
        [
            'a missing localization',
            resources => resources.filter(resource => resource.language !== 'fr'),
        ],
        [
            'an unexpected canonical key',
            resources => [
                ...resources,
                normalizeResource('units', 'fr', {
                    id: 2,
                    name: 'Unexpected',
                    url: 'https://eyefyre.github.io/civvapi/v1/fr/units/unexpected.json',
                }),
            ],
        ],
        ['a duplicate localization', resources => [...resources, resources[0]]],
    ])('rejects %s', (_label, alter) => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-staging-'));
        directories.push(directory);
        const database = createStagingDatabase(join(directory, 'staging.sqlite'));
        const resources = CIV5_LANGUAGES.map(language =>
            normalizeResource('units', language, {
                id: 1,
                name: `Unit ${language}`,
                url: `https://eyefyre.github.io/civvapi/v1/${language}/units/test_unit.json`,
            })
        );

        expect(() => {
            stageResources(database, alter(resources));
            validateStagingCoverage(database, CIV5_LANGUAGES);
        }).toThrow(/units|test_unit|fr/i);
        database.close();
    });
});
