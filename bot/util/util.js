const { MessageEmbed, Collection } = require('discord.js')

module.exports.attackerCalc = function (aforce, totaldam, attacker) {
  const step1 = aforce * attacker.att
  const step3 = step1 * 4.5
  const step5 = step3 / totaldam
  // const step6 = Math.round(step5 * 10) / 10
  const step7 = Math.round(step5 + 0.001)
  return step7
}

module.exports.defenderCalc = function (aforce, totaldam, defender) {
  const step1 = aforce * defender.def
  const step3 = step1 * 4.5
  const step5 = step3 / totaldam
  const step7 = Math.round(step5)
  return step7
}

module.exports.buildEmbed = function (data) {
  const embed = new MessageEmbed().setColor('#ff0066')

  if (data.discord) {
    if (data.discord.title)
      embed.setTitle(data.discord.title)
    if (data.discord.description)
      embed.setDescription(data.discord.description)
    if (data.discord.fields)
      data.discord.fields.forEach(el => {
        embed.addField(el.name, el.value)
      })
  }
  return embed
}

module.exports.poison = function (unit) {
  unit.bonus = 0.8
}

module.exports.boost = function (unit) {
  unit.name = `Boosted ${unit.name}`
  unit.plural = `Boosted ${unit.plural}`
  unit.att = unit.att + 0.5
}

module.exports.saveStats = function (data, db) {
  const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, message_id, server_id, will_delete, attacker_description, defender_description, reply_fields, arg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
  const values = [data.content, data.author_id, data.author_tag, data.command, data.attacker, data.defender, data.url, data.message_id, data.server_id, data.will_delete, data.attacker_description, data.defender_description, data.reply_fields, data.arg]
  db.query(sql, values)
}

module.exports.logUse = function (message, logChannel) {
  let content
  if (message.cleanContent.length > 256)
    content = message.cleanContent.slice(0, 255)
  else
    content = message.cleanContent

  const logData = {
    discord: {
      title: `**${content}**`,
      description: ` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`
    }
  }
  const newEmbed = module.exports.buildEmbed(logData)
  logChannel.send(newEmbed)
}

module.exports.milestoneMsg = async function (message, db, newsChannel, meee) {
  let { rows } = await db.query('SELECT COUNT(st.id) AS "triggers" FROM stats st JOIN servers se ON se.server_id = st.server_id')

  rows = rows[0]
  rows.triggers = parseInt(rows.triggers)

  if (rows.triggers % 50000 === 0) {
    newsChannel.send(`<:yay:585534167274618997>:tada: Thanks to ${message.author} (${message.author.username}), we reached ${rows.triggers} uses! :tada:<:yay:585534167274618997>`)
    meee.send(`<:yay:585534167274618997>:tada: Thanks to ${message.author} (${message.author.username}), we reached **${rows.triggers}** uses! :tada:<:yay:585534167274618997>`)
  }
}

module.exports.handleAliases = function (array) {
  const newArray = array

  const aliases = aliasMap.keyArray()

  if (aliases.some(alias => array.some(str => str.toLowerCase().startsWith(alias)))) {
    const index = array.findIndex(el => aliases.some(alias => alias === el.substring(0, 3).toLowerCase()))
    if (index === -1)
      return

    const openedAlias = aliasMap.get(array[index].substring(0, 3).toLowerCase())
    newArray.splice(index, 1, openedAlias[0], openedAlias[1])
  }

  return newArray
}

const aliasMap = new Collection()

aliasMap.set('dbs', ['de', 'bs'])
aliasMap.set('dsh', ['de', 'sh'])
aliasMap.set('dbo', ['de', 'bo'])

aliasMap.set('gbs', ['gi', 'bs'])
aliasMap.set('gsh', ['gi', 'sh'])
aliasMap.set('gbo', ['gi', 'bo'])

aliasMap.set('wbs', ['wa', 'bs'])
aliasMap.set('wsh', ['wa', 'sh'])
aliasMap.set('wbo', ['wa', 'bo'])

aliasMap.set('kbs', ['kn', 'bs'])
aliasMap.set('ksh', ['kn', 'sh'])
aliasMap.set('kbo', ['kn', 'bo'])

aliasMap.set('dd', ['de', 'd'])
aliasMap.set('dw', ['de', 'w'])

aliasMap.set('wd', ['wa', 'd'])
aliasMap.set('ww', ['wa', 'w'])