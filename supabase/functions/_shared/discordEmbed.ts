// Converts the engine's plain `replyData.discord` object into a Discord REST
// embed JSON object. This is the serverless replacement for the old
// bot/util/util.js `buildEmbed`, which built a discord.js MessageEmbed — there
// is no discord.js here, we emit raw JSON for the HTTP interaction response.
//
// Behavior matches buildEmbed exactly:
//   - color #ff0066
//   - description defaults to '' when absent
//   - a field whose `value` is an array is joined with '\n' (matches addField)

const EMBED_COLOR = 0xff0066

interface ReplyField {
    name: string
    value: string | string[]
}

interface ReplyDiscord {
    title?: string
    description?: string
    fields?: ReplyField[]
    footer?: string
}

export interface DiscordEmbed {
    color: number
    title?: string
    description: string
    fields: { name: string; value: string }[]
}

export function buildEmbed(discord: ReplyDiscord | undefined): DiscordEmbed {
    const embed: DiscordEmbed = {
        color: EMBED_COLOR,
        description: '',
        fields: [],
    }
    if (!discord) return embed

    if (discord.title) embed.title = discord.title
    embed.description = discord.description ?? ''

    if (discord.fields) {
        for (const el of discord.fields) {
            embed.fields.push({
                name: el.name,
                value: Array.isArray(el.value) ? el.value.join('\n') : el.value,
            })
        }
    }
    return embed
}
