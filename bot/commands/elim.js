const fight = require('../util/fightEngine')
const units = require('./units')
const dbStats = require('../../db/index')

module.exports = {
  name: 'elim',
  description: 'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).',
  aliases: ['e'],
  // eslint-disable-next-line no-unused-vars
  shortUsage(prefix) {
    return 'This command is too complicated to show an example. Try `.help elim`'
  },
  longUsage(prefix) {
    return `\`${prefix}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`
  },
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed, willDelete) {
    if(argsStr.length === 0)
      throw 'try `.help e` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    const attacker = units.getUnitFromArray(attackerArray, message, willDelete)
    const defender = units.getUnitFromArray(defenderArray, message, willDelete)

    if(!argsStr.includes('?'))
      throw `\`${process.env.PREFIX}elim\` requires a \`?\`\nYou'll need to either use the \`${process.env.PREFIX}calc\` command or do \`${process.env.PREFIX}help elim\` for more information on how to use it!`

    if(unitsArray[0].includes('?') && unitsArray[1].includes('?')) {
      const attackerClone = { ...attacker }
      const defenderClone = { ...defender }
      message.channel.send(fight.provideDefHP(attacker, defender, embed))
      message.channel.send(fight.provideAttHP(attackerClone, defenderClone, embed))
      this.addStats(message, this.name, attacker, defender, embed, willDelete, true)
        .then().catch(err => { throw err })
      return
    }
    if(unitsArray[0].includes('?')) {
      embed = fight.provideDefHP(attacker, defender, embed)
      this.addStats(message, this.name, attacker, defender, embed, willDelete)
        .then().catch(err => { throw err })
      return embed
    }
    if(unitsArray[1].includes('?')) {
      embed = fight.provideAttHP(attacker, defender, embed)
      this.addStats(message, this.name, attacker, defender, embed, willDelete)
        .then().catch(err => { throw err })
      return embed
    }
  },


  // Add to stats database
  addStats(message, commandName, attacker, defender, embed, willDelete, noEmbed) {
    let replyFields = []

    if(!noEmbed && embed.fields[0])
      replyFields = [ embed.fields[0].name.replace(/\*\*/gi, ''), embed.fields[0].value]

    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, server_id, is_attacker_vet, is_defender_vet, attacker_description, defender_description, will_delete, reply_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, attacker.name, defender.name, message.url, message.guild.id, attacker.vetNow, defender.vetNow, attacker.description, defender.description, willDelete, replyFields]
      dbStats.query(sql, values, (err) => {
        if(err) {
          reject(`${commandName} stats: ${err.stack}\n${message.url}`)
        } else {
          resolve()
        }
      })
    })
  }
}