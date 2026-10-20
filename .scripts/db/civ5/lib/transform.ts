import type { DatabaseSync } from 'node:sqlite';
import { resolveRelationTarget } from './aliases';
import { canonicalResourceKey } from './normalize';
import type { ApiDocument, ApiValue, StagedResource } from '../types';

export interface TransformSummary {
    entities: number;
    translations: number;
}

const DOMAIN_TABLES: Readonly<Record<StagedResource['kind'], string>> = {
    beliefs: 'beliefs',
    buildings: 'buildings',
    citystates: 'citystates',
    civilizations: 'civilizations',
    features: 'features',
    improvements: 'improvements',
    policies: 'policies',
    promotions: 'promotions',
    religions: 'religions',
    resolutions: 'resolutions',
    resources: 'resources',
    specialists: 'specialists',
    tech: 'techs',
    terrains: 'terrains',
    units: 'units',
    wonders: 'wonders',
};

const KNOWN_FIELDS: Readonly<Record<StagedResource['kind'], readonly string[]>> = {
    beliefs: ['id', 'name', 'summary', 'belief_category', 'url'],
    buildings: [
        'id',
        'name',
        'cost',
        'game_info',
        'gold_maintenance',
        'historical_info',
        'icon',
        'prereq_tech',
        'strategy',
        'url',
        'yields',
    ],
    citystates: ['id', 'name', 'category', 'historical_info', 'url'],
    civilizations: [
        'id',
        'name',
        'city_names',
        'dawn_of_man',
        'historical_info',
        'icon',
        'leader',
        'spy_names',
        'unique_buildings',
        'unique_units',
        'url',
    ],
    features: [
        'id',
        'name',
        'combat_modifier',
        'historical_info',
        'icon',
        'movement_cost',
        'resources',
        'url',
        'yields',
    ],
    improvements: [
        'id',
        'name',
        'can_be_built_on',
        'game_info',
        'icon',
        'improves_resources',
        'nearby_mountain_bonus',
        'prereq_tech',
        'required_civ',
        'url',
        'yields',
    ],
    policies: [
        'id',
        'name',
        'branch',
        'game_info',
        'historical_info',
        'icon',
        'required_policies',
        'tenet_level',
        'url',
    ],
    promotions: ['id', 'name', 'game_info', 'icon', 'prereq_promotions', 'url'],
    religions: ['id', 'name', 'summary', 'url'],
    resolutions: ['id', 'name', 'project_prizes', 'resolution_id', 'summary', 'url'],
    resources: [
        'id',
        'name',
        'game_info',
        'historical_info',
        'icon',
        'improved_by',
        'prereq_tech',
        'terrains_found_on',
        'url',
        'yields',
    ],
    specialists: ['id', 'name', 'game_info', 'historical_info', 'icon', 'strategy', 'url'],
    tech: [
        'id',
        'name',
        'building_unlocks',
        'civilopedia_entry',
        'cost',
        'era',
        'icon',
        'quote',
        'tech_prereqs',
        'tech_unlocks',
        'unit_unlocks',
        'url',
    ],
    terrains: [
        'id',
        'name',
        'combat_modifier',
        'features',
        'historical_info',
        'icon',
        'movement_cost',
        'resources',
        'url',
        'yields',
    ],
    units: [
        'id',
        'name',
        'cost',
        'free_promotions',
        'game_info',
        'historical_info',
        'icon',
        'movement',
        'prereq_tech',
        'strategy',
        'url',
    ],
    wonders: [
        'id',
        'name',
        'background_image',
        'game_info',
        'historical_info',
        'icon',
        'production_cost',
        'quote',
        'strategy',
        'tech_prereq',
        'url',
        'yields',
    ],
};

function text(value: ApiValue | undefined): string | null {
    return typeof value === 'string' ? value : null;
}

function number(value: ApiValue | undefined): number | null {
    return typeof value === 'number' ? value : null;
}

function insertDomain(database: DatabaseSync, id: number, resource: StagedResource): void {
    const payload = resource.payload;
    switch (resource.kind) {
        case 'buildings':
            database
                .prepare(
                    'INSERT INTO buildings (entity_id, cost, gold_maintenance, icon) VALUES (?, ?, ?, ?)'
                )
                .run(
                    id,
                    number(payload.cost),
                    number(payload.gold_maintenance),
                    text(payload.icon)
                );
            break;
        case 'beliefs':
            database
                .prepare('INSERT INTO beliefs (entity_id, belief_category) VALUES (?, ?)')
                .run(id, text(payload.belief_category));
            break;
        case 'citystates':
            database
                .prepare('INSERT INTO citystates (entity_id, category) VALUES (?, ?)')
                .run(id, text(payload.category));
            break;
        case 'civilizations':
            database
                .prepare('INSERT INTO civilizations (entity_id, icon) VALUES (?, ?)')
                .run(id, text(payload.icon));
            break;
        case 'policies':
            database
                .prepare(
                    'INSERT INTO policies (entity_id, branch, tenet_level, icon) VALUES (?, ?, ?, ?)'
                )
                .run(id, text(payload.branch), number(payload.tenet_level), text(payload.icon));
            break;
        case 'units':
            database
                .prepare('INSERT INTO units (entity_id, cost, movement, icon) VALUES (?, ?, ?, ?)')
                .run(id, number(payload.cost), number(payload.movement), text(payload.icon));
            break;
        case 'wonders':
            database
                .prepare(
                    'INSERT INTO wonders (entity_id, production_cost, icon, background_image) VALUES (?, ?, ?, ?)'
                )
                .run(
                    id,
                    number(payload.production_cost),
                    text(payload.icon),
                    text(payload.background_image)
                );
            break;
        case 'tech':
            database
                .prepare('INSERT INTO techs (entity_id, cost, era, icon) VALUES (?, ?, ?, ?)')
                .run(id, number(payload.cost), text(payload.era), text(payload.icon));
            break;
        case 'features':
            database
                .prepare(
                    'INSERT INTO features (entity_id, combat_modifier, movement_cost, icon) VALUES (?, ?, ?, ?)'
                )
                .run(
                    id,
                    number(payload.combat_modifier),
                    number(payload.movement_cost),
                    text(payload.icon)
                );
            break;
        case 'improvements':
            database
                .prepare(
                    'INSERT INTO improvements (entity_id, nearby_mountain_bonus, required_civ, icon) VALUES (?, ?, ?, ?)'
                )
                .run(
                    id,
                    number(payload.nearby_mountain_bonus),
                    text(payload.required_civ),
                    text(payload.icon)
                );
            break;
        case 'resolutions':
            database
                .prepare('INSERT INTO resolutions (entity_id, resolution_id) VALUES (?, ?)')
                .run(id, number(payload.resolution_id));
            break;
        case 'resources':
            database
                .prepare('INSERT INTO resources (entity_id, icon) VALUES (?, ?)')
                .run(id, text(payload.icon));
            break;
        case 'terrains':
            database
                .prepare(
                    'INSERT INTO terrains (entity_id, combat_modifier, movement_cost, icon) VALUES (?, ?, ?, ?)'
                )
                .run(
                    id,
                    number(payload.combat_modifier),
                    number(payload.movement_cost),
                    text(payload.icon)
                );
            break;
        default:
            database
                .prepare(`INSERT INTO ${DOMAIN_TABLES[resource.kind]} (entity_id) VALUES (?)`)
                .run(id);
    }
}

function assertKnownFields(resource: StagedResource): void {
    const known = new Set(KNOWN_FIELDS[resource.kind]);
    for (const key of Object.keys(resource.payload))
        if (!known.has(key)) throw new Error(`Unmapped ${resource.kind} field: ${key}`);
}

export function transformStagedResources(
    staged: readonly StagedResource[],
    database: DatabaseSync
): TransformSummary {
    const groups = new Map<string, StagedResource[]>();
    for (const resource of staged)
        groups.set(resource.resourceKey, [...(groups.get(resource.resourceKey) ?? []), resource]);
    const insertEntity = database.prepare(
        'INSERT INTO entities (type, code, source_id) VALUES (?, ?, ?)'
    );
    const insertTranslation = database.prepare(
        'INSERT INTO translations (entity_id, language, name, summary, game_info, strategy, historical_info, quote, dawn_of_man) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const insertYield = database.prepare(
        'INSERT INTO entity_yields (entity_id, yield_type, amount) VALUES (?, ?, ?)'
    );
    const entityIds = new Map<string, number>();
    database.exec('BEGIN');
    try {
        for (const [code, rows] of groups) {
            for (const row of rows) assertKnownFields(row);
            const canonical = rows.find(row => row.language === 'en') ?? rows[0];
            insertEntity.run(canonical.kind, code, canonical.sourceId);
            const id = Number(
                (
                    database.prepare('SELECT last_insert_rowid() AS id').get() as {
                        id: number | bigint;
                    }
                ).id
            );
            entityIds.set(code, id);
            insertDomain(database, id, canonical);
            for (const row of rows) {
                const p = row.payload;
                insertTranslation.run(
                    id,
                    row.language,
                    row.name,
                    text(p.summary),
                    text(p.game_info) ?? text(p.civilopedia_entry),
                    text(p.strategy),
                    text(p.historical_info),
                    text(p.quote),
                    text(p.dawn_of_man)
                );
                if (
                    row.kind === 'civilizations' &&
                    typeof p.leader === 'object' &&
                    p.leader !== null &&
                    !Array.isArray(p.leader)
                ) {
                    const leader = p.leader as ApiDocument;
                    const trait =
                        typeof leader.trait === 'object' &&
                        leader.trait !== null &&
                        !Array.isArray(leader.trait)
                            ? (leader.trait as ApiDocument)
                            : {};
                    const history =
                        Array.isArray(leader.historical_info) &&
                        typeof leader.historical_info[0] === 'object' &&
                        leader.historical_info[0] !== null
                            ? (leader.historical_info[0] as ApiDocument)
                            : {};
                    database
                        .prepare(
                            'INSERT INTO civilization_leaders (civilization_id, language, name, icon, subtitle, trait_name, trait_effect, historical_heading, historical_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
                        )
                        .run(
                            id,
                            row.language,
                            text(leader.name),
                            text(leader.icon),
                            text(leader.subtitle),
                            text(trait.name),
                            text(trait.effect),
                            text(history.heading),
                            text(history.text)
                        );
                }
                if (row.kind === 'civilizations') {
                    for (const [position, name] of (Array.isArray(p.city_names)
                        ? p.city_names
                        : []
                    ).entries())
                        if (typeof name === 'string')
                            database
                                .prepare(
                                    'INSERT INTO civilization_city_names (civilization_id, language, position, name) VALUES (?, ?, ?, ?)'
                                )
                                .run(id, row.language, position, name);
                    for (const [position, name] of (Array.isArray(p.spy_names)
                        ? p.spy_names
                        : []
                    ).entries())
                        if (typeof name === 'string')
                            database
                                .prepare(
                                    'INSERT INTO civilization_spy_names (civilization_id, language, position, name) VALUES (?, ?, ?, ?)'
                                )
                                .run(id, row.language, position, name);
                }
            }
            const yields = canonical.payload.yields;
            if (Array.isArray(yields))
                for (const value of yields) {
                    if (typeof value !== 'object' || value === null || Array.isArray(value))
                        continue;
                    const item = value as ApiDocument;
                    const yieldType = text(item.yield_type) ?? text(item.type);
                    const amount = number(item.amount);
                    if (yieldType !== null && amount !== null)
                        insertYield.run(id, yieldType, amount);
                }
        }
        const entityCodes = new Set(entityIds.keys());
        const insertUnitPromotion = database.prepare(
            'INSERT INTO unit_promotions (unit_id, promotion_id) VALUES (?, ?)'
        );
        const insertPolicyPrerequisite = database.prepare(
            'INSERT INTO policy_prerequisites (policy_id, prerequisite_id) VALUES (?, ?)'
        );
        const insertTechUnlock = database.prepare(
            'INSERT INTO tech_unlocks (tech_id, entity_id) VALUES (?, ?)'
        );
        const insertPromotionPrerequisite = database.prepare(
            'INSERT INTO promotion_prerequisites (promotion_id, prerequisite_id) VALUES (?, ?)'
        );
        const insertTerrainFeature = database.prepare(
            'INSERT INTO terrain_features (terrain_id, feature_id) VALUES (?, ?)'
        );
        const insertTerrainResource = database.prepare(
            'INSERT INTO terrain_resources (terrain_id, resource_id) VALUES (?, ?)'
        );
        const insertFeatureResource = database.prepare(
            'INSERT INTO feature_resources (feature_id, resource_id) VALUES (?, ?)'
        );
        const insertImprovementTerrain = database.prepare(
            'INSERT INTO improvement_buildable_terrains (improvement_id, terrain_id) VALUES (?, ?)'
        );
        const insertImprovementResource = database.prepare(
            'INSERT INTO improvement_resources (improvement_id, resource_id) VALUES (?, ?)'
        );
        const insertCivilizationUnit = database.prepare(
            'INSERT INTO civilization_unique_units (civilization_id, unit_id) VALUES (?, ?)'
        );
        const insertCivilizationBuilding = database.prepare(
            'INSERT INTO civilization_unique_buildings (civilization_id, building_id) VALUES (?, ?)'
        );
        const insertResourceTech = database.prepare(
            'INSERT INTO resource_revealing_techs (resource_id, tech_id) VALUES (?, ?)'
        );
        const targetId = (value: ApiValue, source: string): number => {
            if (typeof value !== 'object' || value === null || Array.isArray(value))
                throw new Error(`Missing relation object for ${source}`);
            const url = (value as ApiDocument).url;
            if (typeof url !== 'string') throw new Error(`Missing relation URL for ${source}`);
            const target = resolveRelationTarget(canonicalResourceKey(url), entityCodes);
            const id = entityIds.get(target);
            if (id === undefined) throw new Error(`Missing relation entity: ${target}`);
            return id;
        };
        for (const rows of groups.values()) {
            const canonical = rows.find(row => row.language === 'en') ?? rows[0];
            const sourceId = entityIds.get(canonical.resourceKey);
            if (sourceId === undefined)
                throw new Error(`Missing source entity: ${canonical.resourceKey}`);
            if (canonical.kind === 'units' && Array.isArray(canonical.payload.free_promotions))
                for (const value of canonical.payload.free_promotions)
                    insertUnitPromotion.run(sourceId, targetId(value, canonical.resourceKey));
            if (canonical.kind === 'policies' && Array.isArray(canonical.payload.required_policies))
                for (const value of canonical.payload.required_policies)
                    insertPolicyPrerequisite.run(sourceId, targetId(value, canonical.resourceKey));
            if (canonical.kind === 'tech') {
                for (const field of ['unit_unlocks', 'building_unlocks'] as const)
                    if (Array.isArray(canonical.payload[field]))
                        for (const value of canonical.payload[field])
                            insertTechUnlock.run(sourceId, targetId(value, canonical.resourceKey));
            }
            if (
                canonical.kind === 'promotions' &&
                Array.isArray(canonical.payload.prereq_promotions)
            )
                for (const value of canonical.payload.prereq_promotions)
                    insertPromotionPrerequisite.run(
                        sourceId,
                        targetId(value, canonical.resourceKey)
                    );
            if (canonical.kind === 'terrains' && Array.isArray(canonical.payload.features))
                for (const value of canonical.payload.features)
                    insertTerrainFeature.run(sourceId, targetId(value, canonical.resourceKey));
            if (canonical.kind === 'terrains' && Array.isArray(canonical.payload.resources))
                for (const value of canonical.payload.resources)
                    insertTerrainResource.run(sourceId, targetId(value, canonical.resourceKey));
            if (canonical.kind === 'features' && Array.isArray(canonical.payload.resources))
                for (const value of canonical.payload.resources)
                    insertFeatureResource.run(sourceId, targetId(value, canonical.resourceKey));
            if (
                canonical.kind === 'improvements' &&
                Array.isArray(canonical.payload.can_be_built_on)
            )
                for (const value of canonical.payload.can_be_built_on)
                    insertImprovementTerrain.run(sourceId, targetId(value, canonical.resourceKey));
            if (
                canonical.kind === 'improvements' &&
                Array.isArray(canonical.payload.improves_resources)
            )
                for (const value of canonical.payload.improves_resources)
                    insertImprovementResource.run(sourceId, targetId(value, canonical.resourceKey));
            if (canonical.kind === 'civilizations' && Array.isArray(canonical.payload.unique_units))
                for (const value of canonical.payload.unique_units)
                    insertCivilizationUnit.run(sourceId, targetId(value, canonical.resourceKey));
            if (
                canonical.kind === 'civilizations' &&
                Array.isArray(canonical.payload.unique_buildings)
            )
                for (const value of canonical.payload.unique_buildings)
                    insertCivilizationBuilding.run(
                        sourceId,
                        targetId(value, canonical.resourceKey)
                    );
            if (
                ['units', 'buildings', 'wonders', 'improvements', 'resources'].includes(
                    canonical.kind
                )
            ) {
                const prerequisite = canonical.payload.prereq_tech ?? canonical.payload.tech_prereq;
                if (prerequisite !== undefined) {
                    const techId = targetId(prerequisite, canonical.resourceKey);
                    insertTechUnlock.run(techId, sourceId);
                    if (canonical.kind === 'resources') insertResourceTech.run(sourceId, techId);
                }
            }
        }
        database.exec('COMMIT');
        return { entities: groups.size, translations: staged.length };
    } catch (error) {
        database.exec('ROLLBACK');
        throw error;
    }
}
