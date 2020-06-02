const dbStats = require('../../db/index')

module.exports = {
  name: 'stats',
  description: 'show uses of the bot locally and globally.\n[You can optionally ping someone].',
  aliases: ['stat'],
  shortUsage(prefix) {
    return `${prefix}stat [@ping]`
  },
  longUsage(prefix) {
    return `${prefix}stats [@ping]`
  },
  forceNoDelete: false,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    const ping = message.mentions.users.first()
    const user = message.mentions.users.first() || message.author

    data.command = this.name
    data.attacker = undefined
    data.defender = undefined
    data.is_attacker_vet = undefined
    data.is_defender_vet = undefined
    data.attacker_description = undefined
    data.defender_description = undefined
    data.reply_fields = undefined

    try {
      // const localsql = 'SELECT COUNT(id) AS count, author_id FROM stats WHERE author_id = $1 AND server_id = $2 GROUP BY author_id'
      const localsql = 'SELECT COUNT(id) AS count, author_id FROM stats WHERE author_id = $1 AND server_id = $2 GROUP BY author_id'
      const localvalues = [user.id, message.guild.id]
      const localUserStats = await dbStats.query(localsql, localvalues)

      const globalsql = 'SELECT COUNT(id) AS count, author_id FROM stats WHERE author_id = $1 GROUP BY author_id'
      const globalvalues = [user.id]
      const globalUserStats = await dbStats.query(globalsql, globalvalues)

      embed.setDescription((ping) ? `These are ${user}'s stats for this bot in ${message.guild.name}` : `These are your stats for this bot in ${message.guild.name}`)
        .addField('Local count', (localUserStats.rows.length > 0) ? localUserStats.rows[0].count : 'Never here')
        .addField('Global count', (globalUserStats.rows.length > 0) ? globalUserStats.rows[0].count : 'Never used at all')

      return embed
    } catch(err) {
      throw err
    }
  }
};