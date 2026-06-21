// Discord interaction request verification (ed25519).
//
// Discord signs every request to the Interactions Endpoint. We MUST verify the
// signature over the RAW request body and reject (401) anything that fails, or
// Discord refuses to accept the endpoint URL at all.
//
// Uses the Deno std hex decoder + the Web Crypto API (Ed25519), both available
// in the Supabase Edge runtime — no external crypto dependency.

import { decodeHex } from 'https://deno.land/std@0.224.0/encoding/hex.ts'

const PUBLIC_KEY = Deno.env.get('DISCORD_PUBLIC_KEY') ?? ''

let cachedKey: CryptoKey | null = null

async function getKey(): Promise<CryptoKey> {
    if (cachedKey) return cachedKey
    cachedKey = await crypto.subtle.importKey(
        'raw',
        decodeHex(PUBLIC_KEY),
        { name: 'Ed25519' },
        false,
        ['verify'],
    )
    return cachedKey
}

/**
 * Verify a Discord interaction request. Returns the raw body text on success
 * (so the caller can JSON.parse it once), or null if the signature is invalid
 * or headers are missing.
 */
export async function verifyRequest(req: Request): Promise<string | null> {
    const signature = req.headers.get('X-Signature-Ed25519')
    const timestamp = req.headers.get('X-Signature-Timestamp')
    const body = await req.text()

    if (!signature || !timestamp || !PUBLIC_KEY) return null

    try {
        const valid = await crypto.subtle.verify(
            { name: 'Ed25519' },
            await getKey(),
            decodeHex(signature),
            new TextEncoder().encode(timestamp + body),
        )
        return valid ? body : null
    } catch {
        return null
    }
}
