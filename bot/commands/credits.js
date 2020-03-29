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
  forceNoDelete: true,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    embed.setColor('#FA8072')
      .setTitle('**PolyCalculator bot credits!**')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'penile partay, WOPWOP, espark, Shiny, LiNoKami, HelloIAmBush, Cake, James.')

    this.addStats(message, this.name, willDelete)
      .then().catch(err => { throw err })
    return embed
  },


  // Add to stats database
  addStats(message, commandName, willDelete) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, url, server_id, will_delete) VALUES ($1, $2, $3, $4, $5, $6, $7)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, message.url, message.guild.id, willDelete]

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