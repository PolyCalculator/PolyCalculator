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

    this.addStats(message, this.name, attacker, defender, embed, willDelete)
      .then().catch(err => { throw err })
    return embed
  },


  // Add to stats database
  addStats(message, commandName, attacker, defender, embed, willDelete) {
    const replyFields = []

    replyFields[0] = embed.fields[0].value
    if(embed.fields[1])
      replyFields[1] = embed.fields[1].value
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, server_id, is_attacker_vet, is_defender_vet, attacker_description, defender_description, will_delete, reply_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, attacker.name, defender.name, message.url, message.guild.id, attacker.vetNow, defender.vetNow, attacker.description, defender.description, willDelete, replyFields]
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

