// The two channel posts kept in the serverless design:
//   - /feedback  -> dev channel (the user's feedback + an owner ping)
//   - milestone  -> news channel (every 25,000th use)
// Both go out via Discord REST with the bot token (discordRest.ts).

import { postChannelMessage } from './discordRest.ts'
import { buildEmbed } from './discordEmbed.ts'

const DEV_CHANNEL_ID = Deno.env.get('DEV_CHANNEL_ID') ?? ''
const NEWS_CHANNEL_ID = Deno.env.get('NEWS_CHANNEL_ID') ?? ''
const OWNER_ID = '217385992837922819'
const MILESTONE_INTERVAL = 25000

/** Post a feedback message to the dev channel (embed + owner ping). */
export async function postFeedback(
    text: string,
    fromUser: string,
): Promise<void> {
    if (!DEV_CHANNEL_ID) {
        console.error('DEV_CHANNEL_ID not set; feedback dropped')
        return
    }
    const embed = buildEmbed({
        title: text,
        description: `From: ${fromUser}`,
    })
    await postChannelMessage(DEV_CHANNEL_ID, { embeds: [embed] })
    await postChannelMessage(DEV_CHANNEL_ID, { content: `<@${OWNER_ID}>` })
}

/** Post a milestone celebration if `total` is a multiple of the interval. */
export async function maybeMilestone(
    total: number | null,
    user: string,
): Promise<void> {
    if (!total || total % MILESTONE_INTERVAL !== 0) return
    if (!NEWS_CHANNEL_ID) {
        console.error('NEWS_CHANNEL_ID not set; milestone skipped')
        return
    }
    await postChannelMessage(NEWS_CHANNEL_ID, {
        content: `<:yay:585534167274618997>:tada: Thanks to ${user}, we reached ${total} uses! :tada:<:yay:585534167274618997>`,
    })
}
