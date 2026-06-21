// Thin Discord REST helpers using the bot token. Used for the two channel
// posts we keep serverlessly: /feedback -> dev channel, milestone -> news
// channel. (Interaction replies themselves go back in the HTTP response, not
// through here.)

const API = 'https://discord.com/api/v10'
const BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN') ?? ''

function botHeaders() {
    return {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
    }
}

/** POST a message to a channel. `payload` is a Discord message body. */
export async function postChannelMessage(
    channelId: string,
    payload: Record<string, unknown>,
): Promise<void> {
    const res = await fetch(`${API}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: botHeaders(),
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        console.error(
            `postChannelMessage ${channelId} failed: ${
                res.status
            } ${await res.text()}`,
        )
    }
}
