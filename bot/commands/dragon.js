const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'dragon',
  description: 'calculate the outcome of a direct hit and splash from a Fire Dragon.',
  aliases: ['fd', 'dr'],
  shortUsage(prefix) {
    return `\`${prefix}dr [15,] wa 7, ri 5\`\n[dragon HP], direct hit, splashed unit, splashed unit\n[] means optional`
  },
  longUsage(prefix) {
    return `\`${prefix}dragon [15,] wa 7, ri 5\`\n[dragon HP], direct hit, splashed unit, splashed unit\n[] means optional`
  },
  forceNoDelete: false,
  category: 'Advanced',
  // category: 'Paid',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function (message, argsStr, replyData, dbData, trashEmoji) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
      replyData.content.push(['Try `.help dr` for more information on how to use this command!', {}])
      return replyData
    }

    const unitsArray = units.getBothUnitArray(argsStr)
    let dragonHP = 20

    if (!isNaN(parseInt(unitsArray[0]))) {
      const hp = unitsArray.shift()
      if (parseInt(hp) < dragonHP)
        dragonHP = parseInt(hp)
    }

    if (unitsArray.length < 1)
      throw 'You need to provide at least the direct hit defender'

    // DRAGON UNIT BUILDING
    const dragonStr = `dr ${dragonHP}`
    const dragonArray = dragonStr.split(/ +/).filter(x => x != '')
    const dragon = units.getUnitFromArray(dragonArray, replyData, trashEmoji)
    dragon.getOverride(dragonArray, replyData)

    // DIRECT HIT UNIT BUILDING
    const directStr = unitsArray.shift()
    const directArray = directStr.split(/ +/).filter(x => x != '')
    const direct = units.getUnitFromArray(directArray, replyData, trashEmoji)
    direct.getOverride(directArray, replyData)

    const splashed = []
    if (unitsArray.length > 0) {
      // SPLASHED[ARRAY] UNIT BUILDING
      while (unitsArray.length > 0) {
        const splashedStr = unitsArray.shift()
        const splashedBits = splashedStr.split(/ +/).filter(x => x != '')
        const defender = units.getUnitFromArray(splashedBits, replyData, trashEmoji)
        defender.getOverride(splashedBits, replyData)
        splashed.push(defender)
      }
    }

    try {
      replyData = await fight.dragon(dragon, direct, splashed, replyData)
    } catch (error) {
      throw error
    }

    dbData.attacker = direct.name
    dbData.defender = splashed.length
    dbData.attacker_description = direct.description

    if (replyData.discord.fields.length > 0)
      dbData.reply_fields = [replyData.discord.fields[0].value.toString(), replyData.discord.fields[1].value]

    return replyData
  }
};