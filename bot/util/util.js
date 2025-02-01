const { MessageEmbed, Collection } = require('discord.js')

function Round(n) {
    const num = (n / 10n) * 10n
    const num2 = num + 10n
    if (n - num < num2 - n) {
        return num
    }
    return num2
}

module.exports.attackerCalc = function (aforce, totaldam, attacker) {
    return Round((aforce * attacker.iAtt() * 450n) / (1000n * totaldam)) / 10n
}

module.exports.defenderCalc = function (aforce, totaldam, defender) {
    return (
        Round(
            (aforce * defender.iDef() * 4500n) /
                (1000n * totaldam * defender.iBonus()),
        ) / 10n
    )
}

module.exports.buildEmbed = function (data) {
    const embed = new MessageEmbed().setColor('#ff0066')

    if (data.discord) {
        if (data.discord.title) embed.setTitle(data.discord.title)
        if (data.discord.description)
            embed.setDescription(data.discord.description)
        else embed.setDescription('')
        if (data.discord.fields)
            data.discord.fields.forEach((el) => {
                if (Array.isArray(el.value))
                    embed.addField(el.name, el.value.join('\n'))
                else embed.addField(el.name, el.value)
            })
    }
    return embed
}

module.exports.poison = function (unit) {
    unit.bonus = 0.7
}

module.exports.freeze = function (unit) {
    unit.description = `${unit.description} (frozen)`
    unit.retaliation = false
}

module.exports.boost = function (unit) {
    unit.name = `Boosted ${unit.name}`
    unit.plural = `Boosted ${unit.plural}`
    unit.att = unit.att + 0.5
}

module.exports.convert = function (unit) {
    if(unit.converted) return

    unit.description = `${unit.description} (converted)`
    // unit.currenthp = 'Converted'
    unit.retaliation = false
    unit.converted = true
}

module.exports.saveStats = function (data, db) {
    const date = new Date()
    const sql =
        'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, message_id, server_id, will_delete, attacker_description, defender_description, reply_fields, arg, is_slash, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)'
    const values = [
        data.content,
        data.author_id,
        data.author_tag,
        data.command,
        data.attacker,
        data.defender,
        data.url,
        data.message_id,
        data.server_id,
        data.will_delete,
        data.attacker_description,
        data.defender_description,
        data.reply_fields,
        data.arg,
        data.isSlash,
        date.toISOString(),
    ]
    db.query(sql, values)
}

module.exports.logInteraction = function (
    interaction,
    logChannel,
    interactionResponse,
) {
    const content = `/${interaction.commandName} ${interaction.options.data
        .map((x) => x.value)
        .join(', ')}`

    const logData = {
        discord: {
            title: `**${content}**`,
            description: ` in **${interaction.guild.name.toUpperCase()}**\nin ${
                interaction.channel
            } (#${interaction.channel.name})\nby ${interaction.user} (${
                interaction.user.tag
            })\n${interactionResponse.url}`,
        },
    }
    const newEmbed = module.exports.buildEmbed(logData)
    logChannel.send({ embeds: [newEmbed] })
}

module.exports.milestoneMsg = async function (message, db, newsChannel) {
    let { rows } = await db.query('SELECT COUNT(id) AS "triggers" FROM stats')

    rows = rows[0]
    rows.triggers = parseInt(rows.triggers)

    if (rows.triggers % 25000 === 0)
        newsChannel.send(
            `<:yay:585534167274618997>:tada: Thanks to ${message.user} (${message.user.username}), we reached ${rows.triggers} uses! :tada:<:yay:585534167274618997>`,
        )
}

module.exports.handleAliases = function (array) {
    const newArray = array

    const aliases = [...aliasMap.keys()]

    array.forEach((newArrayEl) => {
        if (aliases.some((alias) => newArrayEl === alias)) {
            const index = array.findIndex((el) =>
                aliases.some((alias) => alias === el.toLowerCase()),
            )
            if (index !== -1) {
                const openedAlias = aliasMap.get(array[index].toLowerCase())
                newArray.splice(index, 1, openedAlias[0], openedAlias[1])
                if (!openedAlias[1]) newArray.pop()
            }
        }
    })

    return newArray
}

const aliasMap = new Collection()

aliasMap.set('dsh', ['de', 'sc'])
aliasMap.set('dsc', ['de', 'sc'])
aliasMap.set('dbs', ['de', 'bo'])
aliasMap.set('dbo', ['de', 'bo'])
aliasMap.set('drm', ['de', 'rm'])

aliasMap.set('wsh', ['wa', 'sc'])
aliasMap.set('wsc', ['wa', 'sc'])
aliasMap.set('wbo', ['wa', 'bo'])
aliasMap.set('wbs', ['wa', 'bo'])
aliasMap.set('wrm', ['wa', 'rm'])

aliasMap.set('gbs', ['ju', ''])

aliasMap.set('dd', ['de', 'd'])
aliasMap.set('dw', ['de', 'w'])

aliasMap.set('am', ['ri', ''])
aliasMap.set('shark', ['sk', ''])

aliasMap.set('shaman', ['sh', ''])

aliasMap.set('?d', ['?', 'd'])
aliasMap.set('d?', ['d', '?'])

aliasMap.set('?w', ['?', 'w'])
aliasMap.set('w?', ['w', '?'])
