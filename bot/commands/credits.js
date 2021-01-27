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
  execute: function (message, argsStr, replyData/*, dbData*/) {
    replyData.discord.title = '**PolyCalculator bot credits!**'
    replyData.discord.fields.push({ name: 'Developer', value: 'jd (alphaSeahorse)' })
    replyData.discord.fields.push({ name: 'Contributions', value: 'penile partay, MYRIAD CARDS, espark, Shiny, LiNoKami, HelloIAmBush, Cake, James.' })

    return replyData
  }
};