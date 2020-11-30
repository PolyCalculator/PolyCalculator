const advisorCommand = require('../commands/advisor')
const { transferMessage } = require('../util/announcements')
const { MessageEmbed } = require('discord.js')

module.exports.buildEmbed = function (data) {
  const embed = new MessageEmbed().setColor('#ff0066')
  if (data.title)
    embed.setTitle(data.title)
  if (data.description)
    embed.setDescription(data.description)
  if (data.fields)
    data.fields.forEach(el => {
      embed.addField(el.name, el.value)
    })

  return embed
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
    title: `**${content}**`,
    description: ` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`
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

module.exports.advisorPing = async function (message, crawServer, advisors) {
  const replyData = {
    content: [],
    title: undefined,
    description: undefined,
    fields: [],
    footer: undefined
  }
  if (message.mentions.roles.get(advisors.id) && message.guild.id === crawServer.id) {
    const reply = await advisorCommand.execute(message, message.cleanContent, replyData)
    if (reply) {
      message.channel.send(reply.content)
      return false
    }
  } else {
    return transferMessage(message, crawServer)
  }
}