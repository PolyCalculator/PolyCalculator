# This is the story of PolyCalculator

### PolyCalculator is a Discord bot that was developed by [@jd#0001](https://discord.com/channels/@me/217385992837922819) to help the community of a game called The Battle of Polytopia (+15M downloads). The game has math-heavy mechanics making it hard to predict the outcome of fights.

### The community of now (April 2022) over 34k members was relying on a [website](https://frothfrenzy.github.io/polytopiacalculator) making the experience heavy-handed by needing apps (the game itself, the calc website and discord).

### jd solved this by learning NodeJS and building a Discord bot that takes in the input of player text in Discord and spitting out the outcome(s) of the fight.

### Now having been granted the Verified tag on Discord, the bot boasts over 310k uses and has used optimization to calculate the best outcome for a fight!

### To find the Discord server of the bot, follow this [link](https://discord.gg/rtSTmd8)

## Deployment (Docker Compose)

The repo ships with a `docker-compose.yml` that runs the full stack on any host with Docker:

-   **postgres** — PostgreSQL 16 with a persistent volume; `db/init.sql` creates the schema on first start
-   **bot** — the Discord bot (`node bot/index.js`)
-   **api** — the stats API + web frontend (`node server/index.js`), published on `API_PORT` (default 3333)

### First-time setup

```sh
cp .env.example .env   # then fill in TOKEN and POSTGRES_PASSWORD
docker compose up -d --build
```

The bot and API read `DATABASE_URL` (assembled by compose to point at the `postgres` service), so no further wiring is needed. Logs: `docker compose logs -f bot api`.

To (re)register slash commands, run the one-off script inside the image:

```sh
docker compose run --rm -e CLIENTID=... -e GUILDID=... bot node deploy-commands.js
```

### Migrating data from an existing deployment

On the old host, dump the current database, then restore it into the new stack **before** relying on `db/init.sql` data (the placeholder `units` table in particular should come from your real data):

```sh
pg_dump "$OLD_DATABASE_URL" --format=custom --file=polycalculator.dump
docker compose up -d postgres
docker compose cp polycalculator.dump postgres:/tmp/
docker compose exec postgres pg_restore -U polycalculator -d polycalculator --clean --if-exists /tmp/polycalculator.dump
docker compose up -d --build
```
