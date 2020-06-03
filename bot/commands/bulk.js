const fight = require('../util/fightEngine')
const units = require('./units')

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

    data.attacker = attacker.name
    data.defender = defender.name
    data.attacker_description = attacker.description
    data.defender_description = defender.description
    data.reply_fields = [embed.fields[0].value]

    return embed
  }
};