const fight = require('../util/fightEngine')
const units = require('./units')
const { getBothUnitsArray, getUnitFromArray } = require('../unit/use-cases')

module.exports = {
  name: 'calc',
  description: 'calculate the outcome of a fight in the most simple format.',
  aliases: ['c'],
  shortUsage(prefix) {
    return `\`${prefix}c wa 7, ri 5\` or\n\`${prefix}c wa sc, wa bo, wa rm, de d\``
  },
  longUsage(prefix) {
    return `\`${prefix}calc warrior 7, rider 5\` or\n\`${prefix}calc warrior scout, warrior bomber, warrior rmmer, defender d\``
  },
  category: 'Main',
  // category: 'Paid',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, replyData, dbData) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
      replyData.content.push(['Try `.help c` for more information on how to use this command!', {}])
      return replyData
    }

    const unitsArray = getBothUnitsArray(argsStr).filter(x => x != '')

    const defenderStr = unitsArray.pop()
    const defenderArray = defenderStr.split(/ +/)
    const attackers = []

    const defender = getUnitFromArray(defenderArray, replyData)
    defender.getOverride(defenderArray, replyData)

    unitsArray.forEach(x => {
      const attackerArray = x.split(/ +/).filter(y => y != '')
      const attacker = getUnitFromArray(attackerArray, replyData)
      attacker.getOverride(attackerArray, replyData)
      if (attacker.att !== 0)
        attackers.push(attacker)
    })

    if (attackers.length === 0)
      throw 'You need to specify at least one unit with more than 0 attack.'

    try {
      replyData = await fight.calc(attackers, defender, replyData)
    } catch (error) {
      throw error
    }

    dbData.attacker = attackers.length
    dbData.defender = defender.name
    dbData.defender_description = defender.description

    if (replyData.discord.fields.length > 0)
      dbData.reply_fields = [replyData.discord.fields[0].value.toString(), replyData.discord.fields[1].value]

    return replyData
  }
};