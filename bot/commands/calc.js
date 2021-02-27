const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'calc',
  description: 'calculate the outcome of a fight in the most simple format.',
  aliases: ['c'],
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
  execute: async function (message, argsStr, replyData, dbData, trashEmoji) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
      replyData.content.push(['Try `.help c` for more information on how to use this command!', {}])
      return replyData
    }

    const unitsArray = units.getBothUnitArray(argsStr)

    const defenderStr = unitsArray.pop()
    const defenderArray = defenderStr.split(/ +/).filter(x => x != '')
    const attackers = []

    const defender = units.getUnitFromArray(defenderArray, replyData, trashEmoji)
    defender.getOverride(defenderArray, replyData)

    unitsArray.forEach(x => {
      const attackerArray = x.split(/ +/).filter(y => y != '')
      const attacker = units.getUnitFromArray(attackerArray, replyData, trashEmoji)
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