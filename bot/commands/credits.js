const dbStats = require('../../db/index')

module.exports = {
  name: 'credits',
  description: 'show the team!',
  aliases: ['cred', 'credit'],
  shortUsage(prefix) {
    return `${prefix}cred`
  },
  longUsage(prefix) {
    return `${prefix}credits`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    embed.setColor('#FA8072')
      .setTitle('**PolyCalculator bot credits!**')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'penile partay, WOPWOP, LiNoKami, Shiny, HelloIAmBush, Cake, James.')
    // dbStats.addTestStats()
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