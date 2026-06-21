# PolyCalculator

Serverless Discord bot + public HTTP API for The Battle of Polytopia combat,
on Supabase. A pure ESM combat engine is shared by the Discord interactions
endpoint, the public calculator API, and the Jest test suite.

## Commands

-   `/c` (calc) — fixed-order combat calculation. Attackers fight in the order given.
-   `/o` (optim) — optimizer. Tries all attacker permutations to find the best sequence.
-   `/b` (bulk) — how many hits of one unit to kill another.
-   `/e` (elim) — minimum attacker HP to kill, or max defender HP that dies.
-   `/units` `/stats` `/help` `/links` `/credits` `/formula` `/feedback` — info/utility.

## Architecture

Fully serverless — no gateway, no always-on host. Discord posts signed HTTP
interactions to a Supabase Edge Function (Deno).

-   `engine/` — **pure ESM combat engine, the source of truth.** No discord.js,
    no DB, no env. Shared verbatim by Node (Jest) and Deno (Edge Functions).
    -   `engine/combat/sequencer.js` — core `multicombat()` loop. Runs combat per
        attacker, applies effects (poison, freeze, convert), then **resets defender
        state** so each sequence evaluation starts clean.
    -   `engine/combat/fightEngine.js` — `calc()` (single sequence) and `optim()`
        (all permutations). Re-applies effects to the defender for display.
    -   `engine/effects.js` — pure effect helpers: `poison()`, `freeze()`,
        `convert()`, `boost()`, `attackerCalc()`, `defenderCalc()`, `handleAliases()`,
        `aliasMap`. (Was the non-Discord half of the old `bot/util/util.js`.)
    -   `engine/units/unit.js` — unit factory. `engine/units/unitsList.js` — unit
        stats (source of truth for combat; the DB `units` table is API-only).
    -   `engine/commands/{calc,optim,bulk,elim,units}.js` — arg-parsing entrypoints
        returning a plain `replyData` object (the test contract).
-   `supabase/functions/discord-interactions/` — verifies the ed25519 signature,
    handles PING→PONG, routes the 11 slash commands, replies synchronously
    (ephemeral), and records stats + derived server presence via `waitUntil`.
-   `supabase/functions/calc-api/` — public HTTP calculator
    (`GET /calc-api/<command>?a=<args>`), replacing the old Express API.
-   `supabase/functions/_shared/` — `verify.ts` (ed25519), `discordEmbed.ts`
    (replaces the old `buildEmbed`), `db.ts` (service-role Supabase client),
    `notify.ts` (feedback + milestone REST posts), `catalog.ts` (help/links/etc.),
    `engine.ts` (engine re-export), `deferred.ts` (`EdgeRuntime.waitUntil` wrapper).
-   `supabase/migrations/` — `stats`, `servers`, `units`, `stats_total` counter,
    RLS, and the public-API read views.

## Key invariants

-   **Engine purity:** nothing in `engine/` may import discord.js, `pg`, Supabase,
    or read `process.env`/`Deno.env`. The Edge layer adapts; the engine computes.
-   **`multicombat()` state:** any defender state mutated in the attacker loop must
    be saved before and restored after. Saved/restored: `bonus`, `poisoned`,
    `retaliation`, `frozen`, `description`.
-   **Embeds:** the engine emits a plain `replyData.discord` object; only the Edge
    layer's `discordEmbed.ts` turns it into Discord embed JSON.

## Testing

`npm test` runs the Jest suite as native ESM
(`NODE_OPTIONS=--experimental-vm-modules`). Snapshot tests in
`tests/simpleCalc/` cover every unit matchup at every HP via `/c`; integration
tests in `tests/optim.test.js` cover `/o`. **Any snapshot diff is a regression —
never `--updateSnapshot` to make it pass.**

Deno verification (also in CI):

-   `npm run deno:smoke` — the engine loads + runs identically under Deno.
-   `npm run deno:test` — signed-interaction + calc-api handler tests
    (`scripts/test-interaction.mjs`, `scripts/test-calc-api.mjs`).

When modifying combat logic, verify **both** `/c` (one `multicombat()`) and `/o`
(many `multicombat()` calls reusing the same defender — state leaks cause bugs).

## Linting

`npm run lint` (ESLint + Prettier). `engine/` and `tests/` lint as ESM modules;
`supabase/functions/` (Deno/TS) and `scripts/` are excluded from ESLint and
checked by Deno instead. Auto-fix formatting with `npm run format`.

## Deploy

CI (`.github/workflows/ci.yml`): Jest shards + lint, Deno checks, then on push to
`master` — `supabase db push`, `supabase functions deploy`, and
`node scripts/register-commands.mjs` (global slash registration).

Set the Discord **Interactions Endpoint URL** to
`https://ovuptrqnxsutoocmamnp.supabase.co/functions/v1/discord-interactions`.

Required function secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`DISCORD_PUBLIC_KEY`, `DISCORD_BOT_TOKEN`, `DISCORD_APPLICATION_ID`,
`DEV_CHANNEL_ID`, `NEWS_CHANNEL_ID`. Data migration from the old VPS Postgres:
`scripts/migrate-data.sh` (data-only, stats + servers + units).
