// Local test for the discord-interactions handler. Imports the handler
// directly and invokes it with signed Request objects — no server, no Docker.
// Proves: PING->PONG, bad-signature->401, /c exact embed, /o synchronous reply.
//
// Run under Deno (the function's runtime):
//   deno run --allow-read --allow-env scripts/test-interaction.mjs
//
// Generates an ephemeral keypair and sets DISCORD_PUBLIC_KEY in-process before
// importing the handler, so verification uses our test key.

import { encodeHex } from 'https://deno.land/std@0.224.0/encoding/hex.ts'

// 1. Generate an Ed25519 keypair (Web Crypto, same as the function uses).
const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
])
const rawPub = new Uint8Array(
    await crypto.subtle.exportKey('raw', kp.publicKey),
)
Deno.env.set('DISCORD_PUBLIC_KEY', encodeHex(rawPub))
Deno.env.set('SUPABASE_URL', 'http://127.0.0.1:54321')
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test')
Deno.env.set('SUPABASE_ANON_KEY', 'test')
Deno.env.set('DISCORD_BOT_TOKEN', 'test')
Deno.env.set('DEV_CHANNEL_ID', '0')
Deno.env.set('NEWS_CHANNEL_ID', '0')

// 2. Import the handler AFTER the public key is set.
const { handler } = await import(
    '../supabase/functions/discord-interactions/index.ts'
)

async function signedRequest(payload, { badSig = false } = {}) {
    const body = JSON.stringify(payload)
    const timestamp = String(Math.floor(Date.now() / 1000))
    let sigHex
    if (badSig) {
        sigHex = '00'.repeat(64)
    } else {
        const sig = new Uint8Array(
            await crypto.subtle.sign(
                { name: 'Ed25519' },
                kp.privateKey,
                new TextEncoder().encode(timestamp + body),
            ),
        )
        sigHex = encodeHex(sig)
    }
    return new Request('http://localhost/discord-interactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Signature-Ed25519': sigHex,
            'X-Signature-Timestamp': timestamp,
        },
        body,
    })
}

let failures = 0
function check(cond, label, detail) {
    if (cond) console.log(`ok   ${label}`)
    else {
        console.error(`FAIL ${label}${detail ? '\n     ' + detail : ''}`)
        failures++
    }
}

// 1. PING -> PONG
{
    const res = await handler(await signedRequest({ type: 1 }))
    const j = await res.json()
    check(res.status === 200 && j.type === 1, 'PING -> PONG', JSON.stringify(j))
}

// 2. bad signature -> 401
{
    const res = await handler(
        await signedRequest({ type: 1 }, { badSig: true }),
    )
    check(res.status === 401, 'bad signature -> 401', `got ${res.status}`)
}

// 3. /c wa, ri -> exact embed (matches tests/calc.test.js)
{
    const res = await handler(
        await signedRequest({
            type: 2,
            id: '1',
            guild_id: '581872879386492929',
            member: { user: { id: '42', username: 'tester' } },
            data: {
                name: 'c',
                options: [
                    { name: 'attackers', value: 'wa' },
                    { name: 'defender', value: 'ri' },
                ],
            },
        }),
    )
    const j = await res.json()
    const embed = j?.data?.embeds?.[0]
    check(
        res.status === 200 && j.type === 4,
        '/c -> type 4 reply',
        JSON.stringify(j),
    )
    check(
        embed?.description === 'The outcome of the fight is:',
        '/c embed description',
        embed?.description,
    )
    check(
        embed?.fields?.[0]?.value === '**Warrior:** 10 ➔ 8 (**4**)',
        '/c attacker field',
        embed?.fields?.[0]?.value,
    )
    check(
        embed?.fields?.[1]?.value === '10 ➔ 4',
        '/c defender field',
        embed?.fields?.[1]?.value,
    )
    check(
        ((j?.data?.flags ?? 0) & 64) === 0,
        '/c reply is public (not ephemeral)',
        String(j?.data?.flags),
    )
}

// 4. /o 8 attackers -> synchronous type 4, within 3s
{
    const t0 = Date.now()
    const res = await handler(
        await signedRequest({
            type: 2,
            id: '2',
            guild_id: '581872879386492929',
            member: { user: { id: '42', username: 'tester' } },
            data: {
                name: 'o',
                options: [
                    {
                        name: 'attackers',
                        value: 'wa, wa, ri, ri, ar, ar, ca, ca',
                    },
                    { name: 'defender', value: 'de d' },
                ],
            },
        }),
    )
    const ms = Date.now() - t0
    const j = await res.json()
    check(
        res.status === 200 && j.type === 4,
        '/o 8-attacker -> type 4',
        JSON.stringify(j)?.slice(0, 120),
    )
    check(ms < 3000, `/o under 3s deadline (${ms}ms)`)
}

// 5. /help, /links, /credits, /formula, /units all reply type 4
for (const name of ['help', 'links', 'credits', 'formula', 'units']) {
    const res = await handler(
        await signedRequest({
            type: 2,
            id: '3',
            guild_id: '581872879386492929',
            member: { user: { id: '42', username: 'tester' } },
            data: { name, options: [] },
        }),
    )
    const j = await res.json()
    check(
        res.status === 200 && j.type === 4,
        `/${name} -> type 4`,
        JSON.stringify(j)?.slice(0, 120),
    )
}

console.log(
    failures === 0
        ? '\nALL HANDLER CHECKS PASSED'
        : `\n${failures} CHECK(S) FAILED`,
)
Deno.exit(failures === 0 ? 0 : 1)
