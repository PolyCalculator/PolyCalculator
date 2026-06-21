// Discord HTTP Interactions endpoint (serverless replacement for the gateway
// bot). Verifies the request signature, handles the PING handshake, routes the
// 11 slash commands to the pure engine, replies synchronously (public, in
// channel), and records stats + derived server presence after replying.
//
// Deployed with verify_jwt = false (Discord sends no Supabase JWT; auth is the
// ed25519 signature check below).

import { verifyRequest } from '../_shared/verify.ts'
import { buildEmbed } from '../_shared/discordEmbed.ts'
import * as engine from '../_shared/engine.ts'
import {
    renderHelp,
    renderLinks,
    renderCredits,
    renderFormula,
} from '../_shared/catalog.ts'
import {
    saveStats,
    upsertServer,
    bumpStatsTotal,
    statsForUser,
} from '../_shared/db.ts'
import { postFeedback, maybeMilestone } from '../_shared/notify.ts'
import { deferred } from '../_shared/deferred.ts'

// Discord interaction + response type constants.
const PING = 1
const APPLICATION_COMMAND = 2
const PONG = 1
const CHANNEL_MESSAGE = 4

// deno-lint-ignore no-explicit-any
type Json = any

function getOption(interaction: Json, name: string): string | undefined {
    const opt = interaction.data?.options?.find((o: Json) => o.name === name)
    return opt?.value
}

function userLabel(interaction: Json): string {
    const u = interaction.member?.user ?? interaction.user ?? {}
    return u.global_name || u.username || u.id || 'unknown'
}

function userId(interaction: Json): string {
    return (interaction.member?.user ?? interaction.user ?? {}).id ?? ''
}

function reply(embed: unknown, content: string | undefined) {
    const data: Json = { embeds: [embed] }
    if (content) data.content = content
    return json({ type: CHANNEL_MESSAGE, data })
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

// Map a slash command to argsStr in the same shape the engine commands expect
// (mirrors the old bot/interactions/*.js flattening).
function buildArgs(name: string, interaction: Json): string {
    switch (name) {
        case 'c':
        case 'o':
            return [
                getOption(interaction, 'attackers'),
                getOption(interaction, 'defender'),
            ]
                .filter((x) => x !== undefined)
                .join(', ')
        case 'b':
        case 'e':
            return [
                getOption(interaction, 'attacker'),
                getOption(interaction, 'defender'),
            ]
                .filter((x) => x !== undefined)
                .join(', ')
        case 'units':
            return getOption(interaction, 'unit') ?? ''
        case 'help':
            return getOption(interaction, 'command') ?? ''
        default:
            return ''
    }
}

async function runCommand(name: string, interaction: Json) {
    const replyData = engine.makeReplyData()
    let feedback: string | undefined
    const dbData: Json = {
        command: name,
        author_id: userId(interaction),
        author_tag: userLabel(interaction),
        server_id: interaction.guild_id ?? null,
        will_delete: false,
        message_id: interaction.id ?? null,
        is_slash: true,
    }

    switch (name) {
        case 'c': {
            const args = buildArgs(name, interaction)
            dbData.arg = args
            dbData.content = `c ${args}`
            await engine.calc.execute({}, args, replyData, dbData)
            break
        }
        case 'o': {
            const args = buildArgs(name, interaction)
            const target = getOption(interaction, 'target') ?? null
            dbData.arg = args
            dbData.content = `o ${args}`
            await engine.optim.execute({}, args, replyData, dbData, target)
            break
        }
        case 'b': {
            const args = buildArgs(name, interaction)
            dbData.arg = args
            dbData.content = `b ${args}`
            engine.bulk.execute({}, args, replyData, dbData)
            break
        }
        case 'e': {
            const args = buildArgs(name, interaction)
            dbData.arg = args
            dbData.content = `e ${args}`
            engine.elim.execute({}, args, replyData, dbData)
            break
        }
        case 'units': {
            const args = buildArgs(name, interaction)
            dbData.arg = args
            dbData.content = `units ${args}`
            engine.units.execute({}, args, replyData, dbData)
            break
        }
        case 'help':
            renderHelp(replyData, buildArgs(name, interaction))
            break
        case 'links':
            renderLinks(replyData)
            break
        case 'credits':
            renderCredits(replyData)
            break
        case 'formula':
            renderFormula(replyData)
            break
        case 'stats': {
            const targetId =
                getOption(interaction, 'user') ?? userId(interaction)
            const counts = await statsForUser(
                targetId,
                interaction.guild_id ?? '',
            )
            replyData.discord.title = 'PolyCalculator usage'
            replyData.discord.fields.push({
                name: 'Total uses',
                value: String(counts.global),
            })
            replyData.discord.fields.push({
                name: 'Uses in this server',
                value: String(counts.local),
            })
            break
        }
        case 'feedback': {
            const text = getOption(interaction, 'message') ?? ''
            if (text.length < 1) throw 'Input your feedback after the command'
            dbData.arg = text
            dbData.content = `feedback ${text}`
            // The post itself is deferred to waitUntil (REST call); reply now.
            replyData.discord.description = 'Feedback sent! :wave:'
            feedback = text
            break
        }
        default:
            throw `Unknown command: ${name}`
    }

    return { replyData, dbData, feedback }
}

// Post-reply side effects: stats insert, server upsert, milestone, feedback.
// Runs via EdgeRuntime.waitUntil so it doesn't block the user-visible reply.
async function persist(
    name: string,
    interaction: Json,
    dbData: Json,
    feedback: string | undefined,
) {
    try {
        if (interaction.guild_id) await upsertServer(interaction.guild_id)

        if (name === 'feedback' && feedback) {
            await postFeedback(feedback, userLabel(interaction))
        }

        await saveStats({
            content: dbData.content ?? name,
            author_id: dbData.author_id,
            author_tag: dbData.author_tag,
            command: name,
            attacker: dbData.attacker ?? null,
            defender: dbData.defender ?? null,
            url: null,
            server_id: dbData.server_id,
            will_delete: false,
            attacker_description: dbData.attacker_description ?? null,
            defender_description: dbData.defender_description ?? null,
            reply_fields: dbData.reply_fields ?? null,
            arg: dbData.arg ?? null,
            message_id: dbData.message_id ?? null,
            is_slash: true,
        })

        const total = await bumpStatsTotal()
        await maybeMilestone(total, userLabel(interaction))
    } catch (e) {
        console.error('persist failed:', e instanceof Error ? e.message : e)
    }
}

export async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

    const body = await verifyRequest(req)
    if (body === null) return json({ error: 'invalid request signature' }, 401)

    const interaction = JSON.parse(body)

    if (interaction.type === PING) return json({ type: PONG })

    if (interaction.type !== APPLICATION_COMMAND) {
        return json({ error: 'unsupported interaction type' }, 400)
    }

    const name = interaction.data?.name
    try {
        const { replyData, dbData, feedback } = await runCommand(
            name,
            interaction,
        )
        const embed = buildEmbed(replyData.discord)
        const content =
            replyData.content.length !== 0
                ? replyData.content.map((x: Json) => x[0]).join('\n')
                : undefined

        // Fire-and-forget the DB/REST work after responding.
        deferred(persist(name, interaction, dbData, feedback))

        return reply(embed, content)
    } catch (error) {
        const msg =
            typeof error === 'string'
                ? error
                : error instanceof Error
                  ? error.message
                  : String(error)
        // Errors are the engine's user-facing strings; show them ephemerally.
        return reply(buildEmbed({ description: msg }), undefined)
    }
}

// Only start the server when run as the entrypoint (not when imported by tests).
if (import.meta.main) {
    Deno.serve(handler)
}
