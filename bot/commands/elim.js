const fight = require('../util/fightEngine')
const units = require('./units')
const dbStats = require('../../db/index')

module.exports = {
  name: 'elim',
  description: 'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).',
  aliases: ['e'],
  // eslint-disable-next-line no-unused-vars
  shortUsage(prefix) {
    return 'This command is too complicated to show an example. Try `.help elim`'
  },
  longUsage(prefix) {
    return `\`${prefix}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`
  },
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    if(argsStr.length === 0)
      throw 'try `.help e` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, message, willDelete)
    const defender = units.getUnitFromArray(defenderArray, message, willDelete)

    if(!argsStr.includes('?')) {
      message.channel.send(`You didn't provide a \`?\` on any side, so here's the basic calculation that \`${process.env.PREFIX}c ${argsStr}\` would have given you!\nFor more help, do \`${process.env.PREFIX}help e\``)
      return fight.calc(attacker, defender, embed)
    }

    if(unitsArray[0].includes('?') && unitsArray[1].includes('?')) {
      const attackerClone = { ...attacker }
      const defenderClone = { ...defender }
      message.channel.send(fight.provideDefHP(attacker, defender, embed))
      message.channel.send(fight.provideAttHP(attackerClone, defenderClone, embed))
      return
    }
    if(unitsArray[0].includes('?'))
      return fight.provideDefHP(attacker, defender, embed)
    if(unitsArray[1].includes('?'))
      return fight.provideAttHP(attacker, defender, embed)
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
}