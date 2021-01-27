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
  execute: function (message, argsStr, replyData, dbData, trashEmoji) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
      replyData.content.push(['Try `.help b` for more information on how to use this command!', {}])
      return replyData
    }

    const unitsArray = units.getBothUnitArray(argsStr)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, replyData, trashEmoji)
    const defender = units.getUnitFromArray(defenderArray, replyData, trashEmoji)
    replyData = fight.bulk(attacker, defender, replyData)

    dbData.attacker = attacker.name
    dbData.defender = defender.name
    dbData.attacker_description = attacker.description
    dbData.defender_description = defender.description
    dbData.reply_fields = [replyData.discord.fields[0].value.toString()]

    return replyData
  }
};