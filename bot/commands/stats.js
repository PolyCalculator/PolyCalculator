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
  execute: async function(message, argsStr, embed, trashEmoji) {
    const ping = message.mentions.users.first()
    const user = message.mentions.users.first() || message.author

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
      this.addStats(message, this.name, `${user.tag}, ${user.id}`, trashEmoji)
      return embed
    } catch(err) {
      throw err
    }
  },


  // Add to stats database
  addStats(message, commandName, arg, trashEmoji) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, url, server_id, arg, will_delete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, message.url, message.guild.id, arg, trashEmoji]
      dbStats.query(sql, values, (err) => {
        if(err) {
          reject(`${commandName} stats: ${err.stack}\n${message.url}`)
        } else {
          resolve()
        }
      })
    })
  }
};