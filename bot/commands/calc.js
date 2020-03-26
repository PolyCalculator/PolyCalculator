const fight = require('../util/fightEngine')
const units = require('./units')
const dbStats = require('../../db/index')

module.exports = {
  name: 'calc',
  description: 'calculate the outcome of a fight in the most intuitive format.',
  aliases: ['c'],
  shortUsage(prefix) {
    return `${prefix}c wa 7, ri 5`
  },
  longUsage(prefix) {
    return `${prefix}calc warrior 7, rider 5`
  },
  category: 'Main',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      throw 'Try `.help c` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, message, willDelete)
    const defender = units.getUnitFromArray(defenderArray, message, willDelete)
    fight.calc(attacker, defender, embed)

    // dbStats.addTestStats(message, argsStr, this.name, attacker, defender, embed, willDelete)
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