-- Schema for a fresh PolyCalculator database.
-- Runs automatically the first time the postgres container starts with an
-- empty data volume (via /docker-entrypoint-initdb.d).
--
-- If you are migrating from an existing deployment, skip this file and
-- restore a dump instead — see the Deployment section of the README.

-- Discord servers the bot has been invited to (bot/util/dbServers.js)
CREATE TABLE IF NOT EXISTS servers (
    server_id TEXT PRIMARY KEY,
    server_name TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Every command trigger, written by the bot and the web API
-- (bot/util/util.js, server/api/command.js)
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    content TEXT,
    author_id TEXT,
    author_tag TEXT,
    command TEXT,
    attacker TEXT,
    defender TEXT,
    url TEXT,
    message_id TEXT,
    server_id TEXT,
    will_delete BOOLEAN,
    attacker_description TEXT,
    defender_description TEXT,
    reply_fields TEXT,
    arg TEXT,
    is_slash BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stats_command_idx ON stats (command);
CREATE INDEX IF NOT EXISTS stats_server_id_idx ON stats (server_id);

-- Unit reference data, read by the web API's `units` command
-- (server/api/command.js: SELECT * FROM units). When migrating an existing
-- deployment, the restored dump provides the real rows (and columns, if
-- they differ) — this empty table is only a placeholder for fresh installs.
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    max_hp INTEGER,
    attack NUMERIC,
    defence NUMERIC,
    range INTEGER,
    is_naval_unit BOOLEAN NOT NULL DEFAULT FALSE
);
