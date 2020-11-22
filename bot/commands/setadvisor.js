const db = require('../../db')

module.exports = {
  name: 'setadvisor',
  description: 'Set players as advisor for the game/channel it\'s used in',
  aliases: ['setad'],
  shortUsage(prefix) {
    return `${prefix}setadvisor @TheShow`
  },
  longUsage(prefix) {
    return `${prefix}setad @TheShow`
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function (message) {
    const userIds = []

    message.mentions.users.forEach(ping => {
      userIds.push(ping.id)
    })

    userIds

    const eIndex = message.channel.name.search(/(e\d\d)\w+/g) + 1
    const eloNumber = Number(message.channel.name.substring(eIndex, eIndex + 5)) || 0

    const sqlgc = 'SELECT * FROM advisors WHERE channel_id = $1'
    const valuesgc = [message.channel.id]
    const ressel = await db.query(sqlgc, valuesgc)

    if (!ressel.rows[0]) {
      const sql = 'INSERT INTO advisors (channel_id, elo_number, advisors) VALUES ($1, $2, $3)'
      const values = [message.channel.id, eloNumber, userIds]
      await db.query(sql, values)
    } else {
      const sql = 'UPDATE advisors SET advisors = $1 WHERE channel_id = $2'
      const values = [userIds, message.channel.id]
      await db.query(sql, values)
    }

    return `The ${message.mentions.users.size} players you specified were set as Advisors in this game/channel!`
  }
};