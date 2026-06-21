// Public HTTP calculator. Serverless replacement for server/api/command.js.
//
//   GET /calc-api/<command>?a=<args>
//   where <command> is calc|optim|bulk|elim|units (or aliases c|o|b|e|u).
//
// Returns the engine's `outcome` object as JSON (same contract as the old
// Express endpoint). `units` with no args lists units from the DB table.
// Deployed with verify_jwt = false; open with permissive CORS.

import * as engine from '../_shared/engine.ts'
import { listUnits, saveStats } from '../_shared/db.ts'
import { deferred } from '../_shared/deferred.ts'

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS },
    })
}

// command name/alias -> engine module
const ROUTES: Record<string, { execute: (...a: unknown[]) => unknown }> = {
    calc: engine.calc,
    c: engine.calc,
    optim: engine.optim,
    o: engine.optim,
    bulk: engine.bulk,
    b: engine.bulk,
    elim: engine.elim,
    e: engine.elim,
    units: engine.units,
    u: engine.units,
}

export async function handler(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
    if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405)

    const url = new URL(req.url)
    // Path is /calc-api/<command>; take the last non-empty segment.
    const segments = url.pathname.split('/').filter(Boolean)
    const commandName = segments[segments.length - 1]
    const a = url.searchParams.get('a') ?? ''

    const route = ROUTES[commandName]
    if (!route) return json({ error: `unknown command: ${commandName}` }, 404)

    // `units` with no args: serve the DB-backed list (the reason the units
    // table is kept). With args, fall through to the engine lookup.
    if ((commandName === 'units' || commandName === 'u') && a.length === 0) {
        return json(await listUnits())
    }

    const replyData = engine.makeReplyData()
    const dbData: Record<string, unknown> = {
        command: commandName,
        content: `${commandName.charAt(0)} ${a}`,
        author_tag: req.headers.get('x-forwarded-for') ?? 'api',
        author_id: '000000000000000000',
        arg: a,
    }

    try {
        const response = await route.execute({}, a, replyData, dbData, null)

        // Record API usage (matches old behavior; author_id sentinel).
        deferred(
            saveStats({
                content: String(dbData.content),
                author_id: '000000000000000000',
                author_tag: String(dbData.author_tag),
                command: commandName,
                attacker: (dbData.attacker as string) ?? null,
                defender: (dbData.defender as string) ?? null,
                attacker_description:
                    (dbData.attacker_description as string) ?? null,
                defender_description:
                    (dbData.defender_description as string) ?? null,
                reply_fields: (dbData.reply_fields as string[]) ?? null,
                arg: a,
                is_slash: false,
                will_delete: false,
            }),
        )

        return json((response as { outcome: unknown }).outcome)
    } catch (err) {
        return json({ error: typeof err === 'string' ? err : String(err) })
    }
}

if (import.meta.main) {
    Deno.serve(handler)
}
