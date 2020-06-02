const dbStats = require('../../db/index')

module.exports = {
  name: 'credits',
  description: 'show the team!',
  aliases: ['cred', 'credit'],
  shortUsage(prefix) {
    return `${prefix}cred`
  },
  longUsage(prefix) {
    return `${prefix}credits`
  },
  forceNoDelete: true,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function(message, argsStr, embed, trashEmoji, data) {
    embed.setTitle('**PolyCalculator bot credits!**')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'penile partay, WOPWOP, espark, Shiny, LiNoKami, HelloIAmBush, Cake, James.')

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