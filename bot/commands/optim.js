const fight = require('../util/fightEngine')
const units = require('./units')
const db = require('../../db')

module.exports = {
  name: 'optim',
  description: 'returns the best order to use multiple attackers to kill one unit according to these priorities:\n\n - Kill/inflict most damage to the defending unit,\n - Minimize the number of attacker casualties,\n - Minimize the cumulative damage taken by the attackers left alive.\n - Use the least number of attackers',
  aliases: ['o', 'op', 'opti'],
  shortUsage(prefix) {
    return `\`${prefix}o wa bo, wa sh, wa bs, de d\``
  },
  longUsage(prefix) {
    return `\`${prefix}optim wa bo, wa sh, wa bs, de d\``
  },
  forceNoDelete: false,
  category: 'Advanced',
  // category: 'Paid',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function (message, argsStr, replyData, dbData, trashEmoji) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
      replyData.content.push(['Try `.help o` for more information on how to use this command!', {}])
      return replyData
    }

    try {
      const unitsArray = units.getBothUnitArray(argsStr)

      if (unitsArray.length > 4) {
        const sql = 'SELECT user_id FROM premium WHERE user_id = $1'
        const values = [message.author.id]
        const sqlGuild = 'SELECT guild_id FROM premium WHERE guild_id = $1'
        const valuesGuild = [message.guild.id]

        const guildPremium = await db.query(sqlGuild, valuesGuild)
        const meee = message.client.users.cache.get('217385992837922819')
        const calcServer = message.client.guilds.cache.get('581872879386492929')
        const logChannel = calcServer.channels.cache.get('738926248700411994')

        if (guildPremium.rows.length === 0) {
          const userPremium = await db.query(sql, values)
          if (userPremium.rows.length === 0) {
            logChannel.send(`${message.author} (${message.author.tag}) exceeded the max number of optim in **${message.guild.name}**, ${meee}\n${message.url}`)
            replyData.discord.title = 'You need to be a **premium member** to be allows to use `.optim` with more than **3 attackers**.'
            replyData.discord.description = `To become a premium member, you can DM the creator and pay any amount of \`$\`.\nYou can DM ${meee} (${meee.tag}) or wait for him to DM you the PayPal link!`
            replyData.discord.footer = 'The money is used to pay the monthly fee necessary to keep the 24/7 server on which the bot runs, rolling.'
            return replyData
          }
        }
      }

      if (unitsArray.length > 9)
        throw 'You are a greedy (or trolly) little shmuck.\nEntering more than 8 attackers is dangerous for my safety.'

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

      replyData = await fight.optim(attackers, defender, replyData)

      dbData.attacker = attackers.length
      dbData.defender = defender.name
      dbData.defender_description = defender.description
      if (replyData.discord.fields.length > 1)
        dbData.reply_fields = [replyData.discord.fields[0].value.toString(), replyData.discord.fields[1].value]

      return replyData
    } catch (error) {
      throw error
    }
  }
};

