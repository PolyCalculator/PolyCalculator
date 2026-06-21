-- Production-readiness hardening.
--
-- Two independent fixes bundled together:
--   1. Pin bump_stats_total's search_path (Supabase advisor lint 0011).
--   2. Make the public aggregate views actually return data to anon, while
--      keeping raw stats rows (author_id / author_tag) private.

-- ---------------------------------------------------------------------------
-- 1. bump_stats_total: pin search_path.
--
-- A mutable search_path on a function is a (low-likelihood) privilege-
-- escalation vector: a caller could shadow `stats_total` with an object in a
-- schema earlier on the path. Pin it to empty and fully schema-qualify the
-- table. Behaviour is otherwise identical to 0001.
-- ---------------------------------------------------------------------------
create or replace function public.bump_stats_total()
returns bigint
language sql
set search_path = ''
as $$
    update public.stats_total
       set total = total + 1
     where id = true
    returning total;
$$;

-- ---------------------------------------------------------------------------
-- 2. Public aggregate views: run as owner, not as the caller.
--
-- In 0003 these views were created with `security_invoker = true`, so they ran
-- as the querying role (anon). But the underlying stats/servers tables are RLS
-- deny-all for anon (0002), so every aggregate returned ZERO rows — the public
-- "top stats" surface was silently non-functional.
--
-- Decision: these aggregates are public and cross-user (anyone may see the
-- global leaderboards). Recreate them with `security_invoker = false` (owner-
-- run) so they read the full tables and return real counts to anon.
--
-- Raw stats rows stay locked: the views expose ONLY counts + non-identifying
-- labels, never author_id / author_tag. The base-table RLS from 0002 is
-- unchanged, so a direct anon SELECT on stats/servers still returns nothing.
-- (Opening the raw table to anon would publish every user's Discord handle and
-- full command history — explicitly NOT done here.)
-- ---------------------------------------------------------------------------
create or replace view public.top_commands
    with (security_invoker = false) as
    select command, count(*) as count
      from public.stats
     where command is not null
     group by command
     order by count desc
     limit 5;

create or replace view public.top_units_attacker
    with (security_invoker = false) as
    select attacker, count(*) as count
      from public.stats
     where attacker is not null
     group by attacker
     order by count desc
     limit 5;

create or replace view public.top_units_defender
    with (security_invoker = false) as
    select defender, count(*) as count
      from public.stats
     where defender is not null
     group by defender
     order by count desc
     limit 5;

create or replace view public.top_servers
    with (security_invoker = false) as
    select e.server_name, count(t.id) as count
      from public.stats t
      left join public.servers e on t.server_id = e.server_id
     group by e.server_name
     order by count desc
     limit 5;

create or replace view public.totals
    with (security_invoker = false) as
    select
        (select total from public.stats_total where id = true)        as total_uses,
        (select count(distinct author_id) from public.stats)          as unique_users,
        (select count(*) from public.servers where active = true)     as active_servers;

-- Grants from 0003 carry over (anon already has SELECT on these views). Re-stated
-- here for clarity since `create or replace view` preserves existing grants.
grant select on public.top_commands         to anon;
grant select on public.top_units_attacker    to anon;
grant select on public.top_units_defender    to anon;
grant select on public.top_servers           to anon;
grant select on public.totals                to anon;
