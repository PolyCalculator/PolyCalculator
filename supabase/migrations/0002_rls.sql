-- Row Level Security.
--
-- Edge Functions write using the service-role key, which bypasses RLS
-- entirely — so no write policies are defined here. Enabling RLS with no
-- policy means anon/authenticated clients get zero rows, which is what we
-- want for stats (contains author_id / author_tag) and servers.
--
-- Read access for the future public API is granted narrowly in 0003.

alter table public.stats        enable row level security;
alter table public.servers      enable row level security;
alter table public.units        enable row level security;
alter table public.stats_total  enable row level security;

-- No policies on stats / servers / stats_total: locked to service role only.
