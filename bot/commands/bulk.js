const fight = require('../util/fightEngine')
const units = require('./units')
const dbStats = require('../../db/index')

module.exports = {
  name: 'bulk',
  description: 'calculate the number of attackers needed to kill the defender.',
  aliases: ['b'],
  shortUsage(prefix) {
    return `${prefix}b wa, de d`
  },
  longUsage(prefix) {
    return `${prefix}bulk warrior, defender d`
  },
  forceNoDelete: false,
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function(message, argsStr, embed, trashEmoji, data) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      return 'Try `.help b` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, message, trashEmoji)
    const defender = units.getUnitFromArray(defenderArray, message, trashEmoji)
    fight.bulk(attacker, defender, embed)

    data.command = this.name
    data.attacker = undefined
    data.defender = undefined
    data.is_attacker_vet = undefined
    data.is_defender_vet = undefined
    data.attacker_description = undefined
    data.defender_description = undefined
    data.reply_fields = undefined

    return embed
  }
};