const fight = require('../util/fightEngine')
const units = require('./units')
const dbStats = require('../../db/index')

module.exports = {
  name: 'calc',
  description: 'calculate the outcome of a fight in the most simple format.',
  aliases: ['c'],
  // eslint-disable-next-line no-unused-vars
  shortUsage(prefix) {
    return `\`${prefix}c wa 7, ri 5\` or\n\`${prefix}c wa bo, wa sh, wa bs, de d\``
  },
  longUsage(prefix) {
    return `\`${prefix}calc warrior 7, rider 5\` or\n\`${prefix}calc warrior boat, warrior ship, warrior bship, defender d\``
  },
  forceNoDelete: false,
  category: 'Main',
  // category: 'Paid',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, embed, willDelete) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      return 'Try `.help c` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const defenderStr = unitsArray.pop()
    const defenderArray = defenderStr.split(/ +/).filter(x => x != '')
    const attackers = []

    const defender = units.getUnitFromArray(defenderArray, message, willDelete)
    // defender.getOverride(defenderArray)

    unitsArray.forEach(x => {
      const attackerArray = x.split(/ +/).filter(y => y != '')
      const attacker = units.getUnitFromArray(attackerArray, message, willDelete)
      // attacker.getOverride(attackerArray)
      if (attacker.att !== 0)
        attackers.push(attacker)
    })

    if(attackers.length === 0)
      throw 'You need to specify at least one unit with more than 0 attack.'

    try {
      embed = await fight.calc(attackers, defender, embed)
    } catch (error) {
      throw error
    }

    this.addStats(message, this.name, attackers, defender, embed, willDelete)
      .then().catch(err => { throw err })
    return embed
  },


  // Add to stats database
  addStats(message, commandName, attackers, defender, embed, willDelete) {
    const replyFields = []

    replyFields[0] = embed.fields[0].value
    if(embed.fields[1])
      replyFields[1] = embed.fields[1].value
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, server_id, is_defender_vet, defender_description, will_delete, reply_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, attackers.length, defender.name, message.url, message.guild.id, defender.vetNow, defender.description, willDelete, replyFields]
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

