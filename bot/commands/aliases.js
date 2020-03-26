const dbStats = require('../../db/index')

module.exports = {
  name: 'aliases',
  description: 'list all aliases to simplify your life.',
  aliases: ['alias', 'a'],
  shortUsage(prefix) {
    return `${prefix}a`
  },
  longUsage(prefix) {
    return `${prefix}alias`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    const categoriesMapped = {
      Main: {},
      Advanced: {},
      Settings: {},
      Other: {}
    }

    message.client.commands.forEach(cmd => {
      if(cmd.category === 'hidden')
        return

      const category = categoriesMapped[cmd.category]

      category[cmd.name] = {
        aliases: cmd.aliases,
      }
    })

    embed.setTitle('All aliases')
      .setDescription('To simplify your life!')

    for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
      const field = []
      for (const [name, details] of Object.entries(commandsList)) {
        field.push(`**${process.env.PREFIX}${name}**: \`${process.env.PREFIX}${details.aliases.join(`\`, \`${process.env.PREFIX}`)}\``)
      }
      embed.addField(`**${cat}:**`, field)
    }
    // dbStats.addTestStats(message, argsStr, this.name, {}, {}, { fields:[{},{}] }, willDelete)
    //   .then().catch(console.error)
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