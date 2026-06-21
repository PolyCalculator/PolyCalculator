# This is the story of PolyCalculator

### PolyCalculator is a Discord bot that was developed by [@jd#0001](https://discord.com/channels/@me/217385992837922819) to help the community of a game called The Battle of Polytopia (+15M downloads). The game has math-heavy mechanics making it hard to predict the outcome of fights.

### The community of now (April 2022) over 34k members was relying on a [website](https://frothfrenzy.github.io/polytopiacalculator) making the experience heavy-handed by needing apps (the game itself, the calc website and discord).

### jd solved this by learning NodeJS and building a Discord bot that takes in the input of player text in Discord and spitting out the outcome(s) of the fight.

### Now having been granted the Verified tag on Discord, the bot boasts over 310k uses and has used optimization to calculate the best outcome for a fight!

### To find the Discord server of the bot, follow this [link](https://discord.gg/rtSTmd8)

---

## Stack (v2 — serverless)

PolyCalculator runs fully serverless on **Supabase** — no always-on host.

-   **`engine/`** — a pure ESM combat engine (no discord.js, no DB, no env),
    shared verbatim by the Edge Functions and the Jest test suite.
-   **`supabase/functions/discord-interactions`** — Discord HTTP Interactions
    endpoint (Deno): verifies the request signature, routes the slash commands to
    the engine, and replies. Records usage to Postgres.
-   **`supabase/functions/calc-api`** — public HTTP calculator,
    `GET /calc-api/<command>?a=<args>`.
-   **`supabase/migrations/`** — `stats`, `servers`, `units` schema + RLS.

### Develop

```sh
npm install
npm test            # Jest (ESM engine) — full unit-matchup snapshot suite
npm run lint        # ESLint + Prettier
npm run deno:smoke  # engine loads under Deno
npm run deno:test   # Edge Function handler tests
```

See `CLAUDE.md` for architecture details and deploy steps.
