const db = require('../../db')

module.exports = {
  name: 'premium',
  description: 'give premium to someone.',
  aliases: ['p'],
  shortUsage(prefix) {
    return `${prefix}p 217385992837922819 10 notes`
  },
  longUsage(prefix) {
    return `${prefix}premium 217385992837922819 10 notes`
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  channelsAllowed: ['595323493558517780'],
  // eslint-disable-next-line no-unused-vars
  execute: function (message, argsStr, replyData, dbData) {
    if (!argsStr)
      throw 'You need to include information...'

    const args = argsStr.split(/ +/).filter(x => x != '')
    const userId = args.shift()

    if (userId.length < 18)
      throw 'Looks like an invalid ID...'

    const amount = Number(args.shift())

    if (isNaN(amount))
      throw 'Looks like an invalid amount...'

    const notes = args.join(' ') || ''

    const sql = 'INSERT INTO premium (user_id, amount, notes) VALUES ($1, $2, $3)'
    const values = [userId, amount, notes]
    db.query(sql, values)
      .then(() => {
        replyData.content.push(['Successfully made premium!', {}])
      })
      .catch(err => { throw err })
  }
};