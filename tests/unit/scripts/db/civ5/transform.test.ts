import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createFinalDatabase } from '../../../../../.scripts/db/civ5/database';
import { transformStagedResources } from '../../../../../.scripts/db/civ5/lib/transform';
import { CIV5_LANGUAGES } from '../../../../../.scripts/db/civ5/constants';
import type {
    ApiDocument,
    ResourceKind,
    StagedResource,
} from '../../../../../.scripts/db/civ5/types';

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true })));

function resources(kind: ResourceKind, payload: ApiDocument): StagedResource[] {
    return CIV5_LANGUAGES.map((language, index) => ({
        kind,
        language,
        resourceKey: `${kind}/sample`,
        sourceUrl: `https://eyefyre.github.io/civvapi/v1/${language}/${kind}/sample.json`,
        sourceId: index + 1,
        name: `${kind}-${language}`,
        payload: { ...payload, id: index + 1, name: `${kind}-${language}` },
    }));
}

describe('transformStagedResources', () => {
    it('writes typed entities, ten translations and yields without raw tables', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        const staged = [
            ...resources('civilizations', { icon: 'civ.png', city_names: [], spy_names: [] }),
            ...resources('units', { cost: { production: 120, faith: 0 }, movement: 2 }),
            ...resources('tech', { cost: 50, era: 'Ancient', quote: 'Know thyself' }),
            ...resources('policies', { branch: { name: 'Liberty' }, tenet_level: 1 }),
            ...resources('wonders', {
                production_cost: 185,
                yields: { culture: 2, gold: 0 },
            }),
            ...resources('beliefs', { belief_category: 'Pantheon Beliefs', summary: 'A benefit' }),
        ];

        expect(transformStagedResources(staged, database)).toEqual({
            entities: 6,
            translations: 60,
        });
        expect(database.prepare('SELECT COUNT(*) AS count FROM entities').get()).toEqual({
            count: 6,
        });
        expect(database.prepare('SELECT COUNT(*) AS count FROM translations').get()).toEqual({
            count: 60,
        });
        expect(database.prepare('SELECT cost, movement FROM units').get()).toEqual({
            cost: 120,
            movement: 2,
        });
        expect(database.prepare('SELECT branch FROM policies').get()).toEqual({
            branch: 'Liberty',
        });
        expect(database.prepare('SELECT yield_type, amount FROM entity_yields').all()).toEqual([
            { yield_type: 'culture', amount: 2 },
        ]);
        expect(database.prepare('SELECT production_cost FROM wonders').get()).toEqual({
            production_cost: 185,
        });
        expect(database.prepare('SELECT belief_category FROM beliefs').get()).toEqual({
            belief_category: 'Pantheon Beliefs',
        });
        expect(
            database.prepare("SELECT name FROM sqlite_master WHERE name = 'staged_resources'").get()
        ).toBeUndefined();
        database.close();
    });

    it('stores leader fields structurally and rejects an unmapped scalar', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        const civilizations = resources('civilizations', {
            leader: {
                name: 'Washington',
                icon: 'washington.png',
                subtitle: 'President',
                trait: { name: 'Manifest Destiny', effect: 'More land' },
                historical_info: [{ heading: 'History', text: 'A founder' }],
            },
            city_names: [],
            spy_names: [],
        });

        transformStagedResources(civilizations, database);
        expect(
            database
                .prepare('SELECT name, trait_effect FROM civilization_leaders WHERE language = ?')
                .get('en')
        ).toEqual({
            name: 'Washington',
            trait_effect: 'More land',
        });
        expect(() =>
            transformStagedResources(
                resources('beliefs', { belief_category: 'Pantheon', new_scalar: 1 }),
                database
            )
        ).toThrow(/unmapped.*new_scalar/i);
        database.close();
    });

    it('writes typed scalar fields for remaining domain families', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));

        transformStagedResources(
            [
                ...resources('buildings', {
                    cost: { production: 80, faith: 0 },
                    gold_maintenance: 2,
                }),
                ...resources('citystates', { category: 'Maritime' }),
                ...resources('features', { combat_modifier: 25, movement_cost: 2 }),
                ...resources('improvements', {
                    nearby_mountain_bonus: { food: 1 },
                    required_civ: 'Inca',
                }),
                ...resources('resolutions', { resolution_id: 9, project_prizes: [] }),
                ...resources('resources', { terrains_found_on: [], improved_by: [] }),
                ...resources('terrains', { combat_modifier: -10, movement_cost: 1 }),
                ...resources('specialists', {}),
            ],
            database
        );

        expect(database.prepare('SELECT cost, gold_maintenance FROM buildings').get()).toEqual({
            cost: 80,
            gold_maintenance: 2,
        });
        expect(database.prepare('SELECT category FROM citystates').get()).toEqual({
            category: 'Maritime',
        });
        expect(database.prepare('SELECT combat_modifier FROM features').get()).toEqual({
            combat_modifier: 25,
        });
        expect(database.prepare('SELECT resolution_id FROM resolutions').get()).toEqual({
            resolution_id: 9,
        });
        database.close();
    });

    it('writes named relations through canonical CivVAPI keys', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('civilizations', {
                    city_names: [],
                    spy_names: [],
                    unique_units: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/units/sample.json' },
                    ],
                }),
                ...resources('units', {
                    free_promotions: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/promotions/sample.json' },
                    ],
                }),
                ...resources('promotions', {}),
            ],
            database
        );

        expect(database.prepare('SELECT COUNT(*) AS count FROM tech_unlocks').get()).toEqual({
            count: 0,
        });
        expect(database.prepare('SELECT COUNT(*) AS count FROM unit_promotions').get()).toEqual({
            count: 1,
        });
        database.close();
    });

    it('writes prerequisite and technology-unlock relations', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('policies', {
                    required_policies: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/policies/sample_two.json' },
                    ],
                }),
                ...CIV5_LANGUAGES.map((language, index) => ({
                    kind: 'policies' as const,
                    language,
                    resourceKey: 'policies/sample_two',
                    sourceUrl: `https://eyefyre.github.io/civvapi/v1/${language}/policies/sample_two.json`,
                    sourceId: index + 50,
                    name: `policy-two-${language}`,
                    payload: { id: index + 50, name: `policy-two-${language}` },
                })),
                ...resources('units', {}),
                ...resources('tech', {
                    unit_unlocks: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/units/sample.json' },
                    ],
                    tech_prereqs: [],
                }),
            ],
            database
        );

        expect(
            database.prepare('SELECT COUNT(*) AS count FROM policy_prerequisites').get()
        ).toEqual({ count: 1 });
        expect(database.prepare('SELECT COUNT(*) AS count FROM tech_unlocks').get()).toEqual({
            count: 1,
        });
        database.close();
    });

    it('writes promotion and terrain relations', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('promotions', {
                    prereq_promotions: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/promotions/two.json' },
                    ],
                }),
                ...CIV5_LANGUAGES.map((language, index) => ({
                    kind: 'promotions' as const,
                    language,
                    resourceKey: 'promotions/two',
                    sourceUrl: `https://eyefyre.github.io/civvapi/v1/${language}/promotions/two.json`,
                    sourceId: index + 60,
                    name: `promotion-two-${language}`,
                    payload: { id: index + 60, name: `promotion-two-${language}` },
                })),
                ...resources('terrains', {
                    features: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/features/sample.json' },
                    ],
                    resources: [],
                }),
                ...resources('features', { resources: [] }),
            ],
            database
        );

        expect(
            database.prepare('SELECT COUNT(*) AS count FROM promotion_prerequisites').get()
        ).toEqual({ count: 1 });
        expect(database.prepare('SELECT COUNT(*) AS count FROM terrain_features').get()).toEqual({
            count: 1,
        });
        database.close();
    });

    it('writes environmental resource and improvement relations', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        const resourceUrl = 'https://eyefyre.github.io/civvapi/v1/en/resources/sample.json';
        const terrainUrl = 'https://eyefyre.github.io/civvapi/v1/en/terrains/sample.json';
        transformStagedResources(
            [
                ...resources('resources', {
                    terrains_found_on: [{ url: terrainUrl }],
                    improved_by: [],
                }),
                ...resources('terrains', { resources: [{ url: resourceUrl }], features: [] }),
                ...resources('features', { resources: [{ url: resourceUrl }] }),
                ...resources('improvements', {
                    can_be_built_on: [{ url: terrainUrl }],
                    improves_resources: [{ url: resourceUrl }],
                }),
            ],
            database
        );

        expect(database.prepare('SELECT COUNT(*) AS count FROM terrain_resources').get()).toEqual({
            count: 1,
        });
        expect(database.prepare('SELECT COUNT(*) AS count FROM feature_resources').get()).toEqual({
            count: 1,
        });
        expect(
            database.prepare('SELECT COUNT(*) AS count FROM improvement_buildable_terrains').get()
        ).toEqual({ count: 1 });
        expect(
            database.prepare('SELECT COUNT(*) AS count FROM improvement_resources').get()
        ).toEqual({ count: 1 });
        database.close();
    });

    it('writes civilization uniques and direct technology requirements', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('civilizations', {
                    city_names: [],
                    spy_names: [],
                    unique_units: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/units/sample.json' },
                    ],
                    unique_buildings: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/buildings/sample.json' },
                    ],
                }),
                ...resources('units', {
                    prereq_tech: {
                        url: 'https://eyefyre.github.io/civvapi/v1/en/tech/sample.json',
                    },
                }),
                ...resources('buildings', {}),
                ...resources('tech', { tech_prereqs: [] }),
            ],
            database
        );

        expect(
            database.prepare('SELECT COUNT(*) AS count FROM civilization_unique_units').get()
        ).toEqual({ count: 1 });
        expect(
            database.prepare('SELECT COUNT(*) AS count FROM civilization_unique_buildings').get()
        ).toEqual({ count: 1 });
        expect(database.prepare('SELECT COUNT(*) AS count FROM tech_unlocks').get()).toEqual({
            count: 1,
        });
        database.close();
    });

    it('keeps an aliased unique unit when CivVAPI classifies it as a specialist', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('civilizations', {
                    city_names: [],
                    spy_names: [],
                    unique_units: [
                        { url: 'https://eyefyre.github.io/civvapi/v1/en/units/khan.json' },
                    ],
                }),
                ...CIV5_LANGUAGES.map((language, index) => ({
                    kind: 'specialists' as const,
                    language,
                    resourceKey: 'specialists/khan',
                    sourceUrl: `https://eyefyre.github.io/civvapi/v1/${language}/specialists/khan.json`,
                    sourceId: index + 70,
                    name: `khan-${language}`,
                    payload: { id: index + 70, name: `khan-${language}` },
                })),
            ],
            database
        );

        expect(
            database.prepare('SELECT COUNT(*) AS count FROM civilization_unique_units').get()
        ).toEqual({ count: 1 });
        database.close();
    });

    it('writes localized civilization names and resource revealing technologies', () => {
        const directory = mkdtempSync(join(tmpdir(), 'better-civ-transform-'));
        directories.push(directory);
        const database = createFinalDatabase(join(directory, 'final.sqlite'));
        transformStagedResources(
            [
                ...resources('civilizations', {
                    city_names: ['Washington', 'New York'],
                    spy_names: ['Agent Smith'],
                }),
                ...resources('resources', {
                    prereq_tech: {
                        url: 'https://eyefyre.github.io/civvapi/v1/en/tech/sample.json',
                    },
                    terrains_found_on: [],
                    improved_by: [],
                }),
                ...resources('tech', { tech_prereqs: [] }),
            ],
            database
        );

        expect(
            database.prepare('SELECT COUNT(*) AS count FROM civilization_city_names').get()
        ).toEqual({ count: 20 });
        expect(
            database.prepare('SELECT COUNT(*) AS count FROM civilization_spy_names').get()
        ).toEqual({ count: 10 });
        expect(
            database.prepare('SELECT COUNT(*) AS count FROM resource_revealing_techs').get()
        ).toEqual({ count: 1 });
        database.close();
    });
});
