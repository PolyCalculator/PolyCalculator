// Supabase data access for the Edge Functions, using the service-role key
// (bypasses RLS). Replaces the old pg.Pool layer (db/index.js, dbServers.js)
// and the DB half of bot/util/util.js (saveStats, milestoneMsg counting).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
)

export interface StatsRow {
    content: string
    author_id: string
    author_tag?: string | null
    command?: string | null
    attacker?: string | number | null
    defender?: string | null
    url?: string | null
    server_id?: string | null
    will_delete?: boolean | null
    attacker_description?: string | null
    defender_description?: string | null
    reply_fields?: string[] | null
    arg?: string | null
    message_id?: string | null
    is_slash?: boolean | null
}

/** Insert one usage row. */
export async function saveStats(row: StatsRow): Promise<void> {
    const { error } = await supabase.from('stats').insert({
        ...row,
        // attacker can arrive as a number (calc counts attackers); store text.
        attacker: row.attacker == null ? null : String(row.attacker),
        created_at: new Date().toISOString(),
    })
    if (error) console.error('saveStats failed:', error.message)
}

/** Derived presence: mark a guild seen on this interaction. */
export async function upsertServer(
    serverId: string,
    serverName?: string | null,
): Promise<void> {
    const patch: Record<string, unknown> = {
        server_id: serverId,
        active: true,
        last_seen: new Date().toISOString(),
    }
    // Only overwrite server_name when we actually have one (interaction
    // payloads usually don't carry the guild name).
    if (serverName) patch.server_name = serverName

    const { error } = await supabase
        .from('servers')
        .upsert(patch, { onConflict: 'server_id' })
    if (error) console.error('upsertServer failed:', error.message)
}

/** Increment the milestone counter; returns the new total (or null on error). */
export async function bumpStatsTotal(): Promise<number | null> {
    const { data, error } = await supabase.rpc('bump_stats_total')
    if (error) {
        console.error('bumpStatsTotal failed:', error.message)
        return null
    }
    return typeof data === 'number' ? data : Number(data)
}

/** /stats: usage counts for a user, globally and in the current server. */
export async function statsForUser(
    authorId: string,
    serverId: string,
): Promise<{ global: number; local: number }> {
    const [globalRes, localRes] = await Promise.all([
        supabase
            .from('stats')
            .select('id', { count: 'exact', head: true })
            .eq('author_id', authorId),
        supabase
            .from('stats')
            .select('id', { count: 'exact', head: true })
            .eq('author_id', authorId)
            .eq('server_id', serverId),
    ])
    return {
        global: globalRes.count ?? 0,
        local: localRes.count ?? 0,
    }
}

/** Public API: full unit list from the DB (calc-api /units list mode). */
export async function listUnits(): Promise<unknown[]> {
    const { data, error } = await supabase.from('units').select('*')
    if (error) {
        console.error('listUnits failed:', error.message)
        return []
    }
    return data ?? []
}
