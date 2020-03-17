const fight = require('../util/fightEngine')
const units = require('./units')

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
  execute(message, argsStr, embed) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      throw 'Try `.help c` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, message)
    const defender = units.getUnitFromArray(defenderArray, message)
    fight.calc(attacker, defender, embed)
    return embed
  }
};