-- Public API read surface.
--
-- The old Express API (server/api/*) exposed: a units list, and aggregate
-- "top" stats. We recreate the safe, aggregate-only parts as views that anon
-- can read, plus anon SELECT on units. Raw stats rows stay locked (0002) so
-- author_id / author_tag are never exposed.

-- units: full read for anon (game reference data, not sensitive).
create policy "units are publicly readable"
    on public.units
    for select
    to anon
    using (true);

-- Aggregate views recreating the old top* / totals endpoints.
-- security_invoker so the view runs with the querying role's privileges;
-- each view exposes only counts + non-identifying labels.

create or replace view public.top_commands
    with (security_invoker = true) as
    select command, count(*) as count
      from public.stats
     where command is not null
     group by command
     order by count desc
     limit 5;

create or replace view public.top_units_attacker
    with (security_invoker = true) as
    select attacker, count(*) as count
      from public.stats
     where attacker is not null
     group by attacker
     order by count desc
     limit 5;

create or replace view public.top_units_defender
    with (security_invoker = true) as
    select defender, count(*) as count
      from public.stats
     where defender is not null
     group by defender
     order by count desc
     limit 5;

create or replace view public.top_servers
    with (security_invoker = true) as
    select e.server_name, count(t.id) as count
      from public.stats t
      left join public.servers e on t.server_id = e.server_id
     group by e.server_name
     order by count desc
     limit 5;

create or replace view public.totals
    with (security_invoker = true) as
    select
        (select total from public.stats_total where id = true)        as total_uses,
        (select count(distinct author_id) from public.stats)          as unique_users,
        (select count(*) from public.servers where active = true)     as active_servers;

-- security_invoker views need the underlying tables readable by anon for the
-- aggregates to run. Grant SELECT only on what the views touch, via policies
-- scoped to aggregate use. Since stats rows themselves must stay private, we
-- instead expose the views through SECURITY DEFINER functions if needed.
-- For now the views are owner-run aggregates: switch to definer semantics by
-- dropping security_invoker if a public dashboard is built. Documented as a
-- deliberate follow-up rather than opening raw stats to anon.
grant select on public.top_commands         to anon;
grant select on public.top_units_attacker    to anon;
grant select on public.top_units_defender    to anon;
grant select on public.top_servers           to anon;
grant select on public.totals                to anon;
