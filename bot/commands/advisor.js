const db = require('../../db')

module.exports = {
  name: 'advisor',
  description: 'Ping game-specific advisors for Crawfish server!',
  aliases: ['advisors', 'ad'],
  shortUsage(prefix) {
    return `${prefix}advisor`
  },
  longUsage(prefix) {
    return `${prefix}ad`
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function (message, argsStr, replyData/*, dbData*/) {
    const sql = 'SELECT * FROM advisors WHERE channel_id = $1'
    const values = [message.channel.id]
    const { rows } = await db.query(sql, values)

    if (!rows[0]) {
      const actualAdvisors = message.guild.roles.cache.get('618158885169004555') // @People giving advice
      return [argsStr, actualAdvisors]
    }

    const advisors = rows[0].advisors

    // '780148610390163486'
    const pings = []
    advisors.forEach(x => {
      const member = message.guild.members.cache.get(x)
      pings.push(member)
    })

    replyData.content.push(argsStr)
    replyData.content.push(pings.join(', '))
    return replyData
  }
};