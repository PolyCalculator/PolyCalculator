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
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      return 'Try `.help o` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    if(unitsArray.length > 4) {
      const sql = 'SELECT user_id FROM premium WHERE user_id = $1'
      const values = [message.author.id]

      try {
        const { rows } = await db.query(sql, values)
        if(rows.length === 0) {
          const calcServer = message.client.guilds.cache.get('581872879386492929')
          const meee = message.client.users.cache.get('217385992837922819')
          const logChannel = calcServer.channels.cache.get('648688924155314176')
          logChannel.send(`${message.author} (${message.author.tag}) exceeded the max number of optim in **${message.guild.name}**, ${meee}\n${message.url}`)
          return embed.setTitle('You need to be a **premium member** to be allows to use `.optim` with more than **3 attackers**.')
            .setDescription(`To become a premium member, you can DM the creator and pay any amount of \`$\`.\nYou can DM ${meee} (${meee.tag}) or wait for him to DM you!`)
            .setFooter('The money is used to pay the monthly fee necessary to keep the 24/7 server on which the bot runs, rolling.')
        }
      } catch (error) {
        console.error
      }
    }

    if(unitsArray.length > 9)
      throw 'You are a greedy (or trolly) little shmuck.\nEntering more than 8 attackers is dangerous for my safety.'

    const defenderStr = unitsArray.pop()
    const defenderArray = defenderStr.split(/ +/).filter(x => x != '')
    const attackers = []

    const defender = units.getUnitFromArray(defenderArray, message, trashEmoji)
    // defender.getOverride(defenderArray)

    unitsArray.forEach(x => {
      const attackerArray = x.split(/ +/).filter(y => y != '')
      const attacker = units.getUnitFromArray(attackerArray, message, trashEmoji)
      // attacker.getOverride(attackerArray)
      if (attacker.att !== 0)
        attackers.push(attacker)
    })
    if(attackers.length === 0)
      throw 'You need to specify at least one unit with more than 0 attack.'

    try {
      embed = await fight.optim(attackers, defender, embed)
    } catch (error) {
      throw error
    }

    data.attacker = attackers.length
    data.defender = defender.name
    data.defender_description = defender.description
    if(embed.fields !== undefined)
      data.reply_fields = [embed.fields[0].value, embed.fields[1].value]

    return embed
  }
};

