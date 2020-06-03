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
  execute: function(message, argsStr, embed) {
    embed.setTitle('**PolyCalculator bot credits!**')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'penile partay, WOPWOP, espark, Shiny, LiNoKami, HelloIAmBush, Cake, James.')

    return embed
  }
};