PRAGMA foreign_keys = ON;

CREATE TABLE entities (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    code TEXT NOT NULL,
    source_id INTEGER,
    UNIQUE (type, code)
);

CREATE TABLE translations (
    entity_id INTEGER NOT NULL REFERENCES entities(id),
    language TEXT NOT NULL,
    name TEXT,
    summary TEXT,
    game_info TEXT,
    strategy TEXT,
    historical_info TEXT,
    quote TEXT,
    dawn_of_man TEXT,
    PRIMARY KEY (entity_id, language)
);

CREATE TABLE entity_yields (
    entity_id INTEGER NOT NULL REFERENCES entities(id),
    yield_type TEXT NOT NULL,
    amount REAL NOT NULL,
    PRIMARY KEY (entity_id, yield_type)
);

CREATE TABLE civilizations (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), icon TEXT);
CREATE TABLE beliefs (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), belief_category TEXT);
CREATE TABLE policies (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), branch TEXT, tenet_level INTEGER, icon TEXT);
CREATE TABLE units (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), cost INTEGER, movement INTEGER, icon TEXT);
CREATE TABLE buildings (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), cost INTEGER, gold_maintenance INTEGER, icon TEXT);
CREATE TABLE wonders (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), production_cost INTEGER, icon TEXT, background_image TEXT);
CREATE TABLE techs (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), cost INTEGER, era TEXT, icon TEXT);
CREATE TABLE promotions (entity_id INTEGER PRIMARY KEY REFERENCES entities(id));
CREATE TABLE resources (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), icon TEXT);
CREATE TABLE improvements (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), nearby_mountain_bonus INTEGER, required_civ TEXT, icon TEXT);
CREATE TABLE terrains (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), combat_modifier INTEGER, movement_cost INTEGER, icon TEXT);
CREATE TABLE features (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), combat_modifier INTEGER, movement_cost INTEGER, icon TEXT);
CREATE TABLE religions (entity_id INTEGER PRIMARY KEY REFERENCES entities(id));
CREATE TABLE citystates (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), category TEXT);
CREATE TABLE resolutions (entity_id INTEGER PRIMARY KEY REFERENCES entities(id), resolution_id INTEGER);
CREATE TABLE specialists (entity_id INTEGER PRIMARY KEY REFERENCES entities(id));

CREATE TABLE civilization_city_names (
    civilization_id INTEGER NOT NULL REFERENCES civilizations(entity_id),
    language TEXT NOT NULL,
    position INTEGER NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (civilization_id, language, position)
);
CREATE TABLE civilization_spy_names (
    civilization_id INTEGER NOT NULL REFERENCES civilizations(entity_id),
    language TEXT NOT NULL,
    position INTEGER NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (civilization_id, language, position)
);
CREATE TABLE civilization_leaders (
    civilization_id INTEGER NOT NULL REFERENCES civilizations(entity_id),
    language TEXT NOT NULL,
    name TEXT,
    icon TEXT,
    subtitle TEXT,
    trait_name TEXT,
    trait_effect TEXT,
    historical_heading TEXT,
    historical_text TEXT,
    PRIMARY KEY (civilization_id, language)
);
CREATE TABLE civilization_unique_units (
    civilization_id INTEGER NOT NULL REFERENCES civilizations(entity_id),
    unit_id INTEGER NOT NULL REFERENCES units(entity_id),
    PRIMARY KEY (civilization_id, unit_id)
);
CREATE TABLE civilization_unique_buildings (
    civilization_id INTEGER NOT NULL REFERENCES civilizations(entity_id),
    building_id INTEGER NOT NULL REFERENCES buildings(entity_id),
    PRIMARY KEY (civilization_id, building_id)
);
CREATE TABLE policy_prerequisites (
    policy_id INTEGER NOT NULL REFERENCES policies(entity_id),
    prerequisite_id INTEGER NOT NULL REFERENCES policies(entity_id),
    PRIMARY KEY (policy_id, prerequisite_id)
);
CREATE TABLE unit_promotions (
    unit_id INTEGER NOT NULL REFERENCES units(entity_id),
    promotion_id INTEGER NOT NULL REFERENCES promotions(entity_id),
    PRIMARY KEY (unit_id, promotion_id)
);
CREATE TABLE unit_required_resources (
    unit_id INTEGER NOT NULL REFERENCES units(entity_id),
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    amount REAL,
    PRIMARY KEY (unit_id, resource_id)
);
CREATE TABLE building_prerequisites (
    building_id INTEGER NOT NULL REFERENCES buildings(entity_id),
    prerequisite_id INTEGER NOT NULL REFERENCES buildings(entity_id),
    PRIMARY KEY (building_id, prerequisite_id)
);
CREATE TABLE building_required_resources (
    building_id INTEGER NOT NULL REFERENCES buildings(entity_id),
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    amount REAL,
    PRIMARY KEY (building_id, resource_id)
);
CREATE TABLE tech_unlocks (
    tech_id INTEGER NOT NULL REFERENCES techs(entity_id),
    entity_id INTEGER NOT NULL REFERENCES entities(id),
    PRIMARY KEY (tech_id, entity_id)
);
CREATE TABLE promotion_prerequisites (
    promotion_id INTEGER NOT NULL REFERENCES promotions(entity_id),
    prerequisite_id INTEGER NOT NULL REFERENCES promotions(entity_id),
    PRIMARY KEY (promotion_id, prerequisite_id)
);
CREATE TABLE resource_revealing_techs (
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    tech_id INTEGER NOT NULL REFERENCES techs(entity_id),
    PRIMARY KEY (resource_id, tech_id)
);
CREATE TABLE improvement_buildable_terrains (
    improvement_id INTEGER NOT NULL REFERENCES improvements(entity_id),
    terrain_id INTEGER NOT NULL REFERENCES terrains(entity_id),
    PRIMARY KEY (improvement_id, terrain_id)
);
CREATE TABLE improvement_resources (
    improvement_id INTEGER NOT NULL REFERENCES improvements(entity_id),
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    PRIMARY KEY (improvement_id, resource_id)
);
CREATE TABLE terrain_features (
    terrain_id INTEGER NOT NULL REFERENCES terrains(entity_id),
    feature_id INTEGER NOT NULL REFERENCES features(entity_id),
    PRIMARY KEY (terrain_id, feature_id)
);
CREATE TABLE terrain_resources (
    terrain_id INTEGER NOT NULL REFERENCES terrains(entity_id),
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    PRIMARY KEY (terrain_id, resource_id)
);
CREATE TABLE feature_resources (
    feature_id INTEGER NOT NULL REFERENCES features(entity_id),
    resource_id INTEGER NOT NULL REFERENCES resources(entity_id),
    PRIMARY KEY (feature_id, resource_id)
);

CREATE INDEX translations_language ON translations (language);
CREATE INDEX entity_yields_entity ON entity_yields (entity_id);
CREATE INDEX civilization_city_names_language ON civilization_city_names (language);
CREATE INDEX civilization_spy_names_language ON civilization_spy_names (language);
CREATE INDEX civilization_leaders_language ON civilization_leaders (language);
CREATE INDEX civilization_unique_units_target ON civilization_unique_units (unit_id);
CREATE INDEX civilization_unique_buildings_target ON civilization_unique_buildings (building_id);
CREATE INDEX policy_prerequisites_target ON policy_prerequisites (prerequisite_id);
CREATE INDEX unit_promotions_target ON unit_promotions (promotion_id);
CREATE INDEX unit_required_resources_target ON unit_required_resources (resource_id);
CREATE INDEX building_prerequisites_target ON building_prerequisites (prerequisite_id);
CREATE INDEX building_required_resources_target ON building_required_resources (resource_id);
CREATE INDEX tech_unlocks_target ON tech_unlocks (entity_id);
CREATE INDEX promotion_prerequisites_target ON promotion_prerequisites (prerequisite_id);
CREATE INDEX resource_revealing_techs_target ON resource_revealing_techs (tech_id);
CREATE INDEX improvement_buildable_terrains_target ON improvement_buildable_terrains (terrain_id);
CREATE INDEX improvement_resources_target ON improvement_resources (resource_id);
CREATE INDEX terrain_features_target ON terrain_features (feature_id);
CREATE INDEX terrain_resources_target ON terrain_resources (resource_id);
CREATE INDEX feature_resources_target ON feature_resources (resource_id);
