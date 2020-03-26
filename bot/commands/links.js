const dbStats = require('../../db/index')

module.exports = {
  name: 'links',
  description: 'show the link to invite the bot, to the developer\'s server and to the statistic\'s webiste.',
  aliases: ['link', 'inv', 'invite', 'server'],
  shortUsage(prefix) {
    return `${prefix}inv`
  },
  longUsage(prefix) {
    return `${prefix}link`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    embed.setColor('#FA8072')
      .setTitle('Links!')
      .addField('Invite to my server:', 'https://discordapp.com/oauth2/authorize?client_id=593507058905645057&permissions=8&scope=bot')
      .addField('PolyCalculator\'s server link:', 'https://discord.gg/rtSTmd8')
      .addField('Documentation (How-to use the bot):', 'https://docs.polycalculatorbot.com')
      .addField('Website (Stats):', 'https://polycalculatorbot.com')

    return embed
  },


  // Add to stats database
  addStats: function(message, argStr, commandName, success, willDelete) {
    const date = Date();
    const replyFields = [success]

    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO test_stats (content, author_id, author_tag, command, reply_fields, url, date, server_id, will_delete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
      const values = [message.cleanContent, message.author.id, message.author.tag, commandName, replyFields, message.url, date, message.guild.id, willDelete]

      dbStats.query(sql, values, (err, res) => {
        if(err) {
          reject(`Stats: ${err.stack}\n${message.url}`)
        } else {
          resolve()
        }
      })
    })
  }
};