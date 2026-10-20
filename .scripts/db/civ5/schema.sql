PRAGMA foreign_keys = ON;

CREATE TABLE imports (
    id INTEGER PRIMARY KEY,
    game_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    imported_at TEXT NOT NULL,
    schema_version INTEGER NOT NULL
);

CREATE TABLE resources (
    id INTEGER PRIMARY KEY,
    import_id INTEGER NOT NULL REFERENCES imports(id),
    kind TEXT NOT NULL,
    resource_key TEXT NOT NULL,
    UNIQUE (import_id, kind, resource_key)
);

CREATE TABLE resource_localizations (
    resource_id INTEGER NOT NULL REFERENCES resources(id),
    language TEXT NOT NULL,
    source_url TEXT NOT NULL,
    name TEXT,
    payload_json TEXT NOT NULL,
    PRIMARY KEY (resource_id, language)
);

CREATE TABLE resource_relations (
    source_resource_id INTEGER NOT NULL REFERENCES resources(id),
    target_kind TEXT NOT NULL,
    target_resource_key TEXT NOT NULL,
    relation_path TEXT NOT NULL,
    position INTEGER,
    PRIMARY KEY (source_resource_id, target_kind, target_resource_key, relation_path, position)
);

CREATE INDEX resource_lookup ON resources (import_id, kind, resource_key);
CREATE INDEX localization_lookup ON resource_localizations (language, name);
CREATE INDEX relation_lookup ON resource_relations (target_kind, target_resource_key);
