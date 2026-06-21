#!/usr/bin/env bash
# Data-only migration: VPS Postgres -> Supabase.
#
# Migrates ONLY the three live tables (stats, servers, units). The orphan
# tables (premium, advisors) and derived views are intentionally left behind.
#
# Prereqs:
#   - Schema already applied to Supabase: `supabase db push` (runs 0001-0003).
#   - pg_dump / pg_restore / psql v15+ on PATH.
#
# Required env vars:
#   VPS_DATABASE_URL       postgres://... (source, the old VPS database)
#   SUPABASE_DB_URL        the Supabase direct connection string
#                          (Dashboard -> Project Settings -> Database ->
#                           Connection string -> URI; use the direct/session one,
#                           not the transaction pooler, for restore)
#
# Usage:
#   VPS_DATABASE_URL=... SUPABASE_DB_URL=... ./scripts/migrate-data.sh
set -euo pipefail

: "${VPS_DATABASE_URL:?set VPS_DATABASE_URL to the source database}"
: "${SUPABASE_DB_URL:?set SUPABASE_DB_URL to the Supabase connection string}"

DUMP="polycalc-data.dump"

echo "==> 1/5 Dumping data-only (stats, servers, units) from source..."
pg_dump "$VPS_DATABASE_URL" \
    --data-only --no-owner --no-privileges --format=custom \
    --table=public.stats --table=public.servers --table=public.units \
    --file "$DUMP"
echo "    wrote $DUMP"

echo "==> 2/5 Source row counts (for verification)..."
psql "$VPS_DATABASE_URL" -tAc \
    "select 'stats', count(*) from public.stats
     union all select 'servers', count(*) from public.servers
     union all select 'units', count(*) from public.units;"

echo "==> 3/5 Restoring data into Supabase (triggers disabled during load)..."
pg_restore --data-only --no-owner --disable-triggers \
    -d "$SUPABASE_DB_URL" "$DUMP"

echo "==> 4/5 Resetting stats identity sequence + seeding stats_total..."
psql "$SUPABASE_DB_URL" -c \
    "select setval(pg_get_serial_sequence('public.stats','id'),
                   coalesce((select max(id) from public.stats), 1));"
psql "$SUPABASE_DB_URL" -c \
    "update public.stats_total
        set total = (select count(*) from public.stats)
      where id = true;"

echo "==> 5/5 Destination row counts (compare against step 2)..."
psql "$SUPABASE_DB_URL" -tAc \
    "select 'stats', count(*) from public.stats
     union all select 'servers', count(*) from public.servers
     union all select 'units', count(*) from public.units
     union all select 'stats_total', total from public.stats_total where id = true;"

echo "==> Done. Verify the counts match before going live."
