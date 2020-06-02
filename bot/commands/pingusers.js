const db = require('../../db/index')

module.exports = {
  name: 'pingusers',
  description: 'ping every user with at least 100 uses.',
  aliases: ['pingall'],
  shortUsage() {
    return undefined
  },
  longUsage() {
    return undefined
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  channelsAllowed: ['595323493558517780'],
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, embed, trashEmoji, data) {
    if(!argsStr)
      throw 'You need to include a message...'

    const sql = 'SELECT COUNT(id) AS count, author_id FROM stats GROUP BY author_id'

    db.query(sql)
      .then(res => {
        res.rows.forEach(userDb => {
          const user = message.client.users.cache.get(userDb.author_id)
          if(user)
            user.send(argsStr + `\nThank you for your support and trust in this tool with the ${userDb.count} times you've used it!`)
              .then(message.channel.send(`Message sent to ${user} (${user.tag})!`)).catch(console.error)
        })
      }).catch(console.error)
  }
};