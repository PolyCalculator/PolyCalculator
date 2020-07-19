module.exports = {
  name: 'links',
  description: 'show the link to invite the bot, to the developer\'s server and to the statistic\'s website.',
  aliases: ['link', 'inv', 'invite', 'server'],
  shortUsage(prefix) {
    return `${prefix}inv`
  },
  longUsage(prefix) {
    return `${prefix}link`
  },
  forceNoDelete: true,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function(message, argsStr, embed) {
    embed.setTitle('Links!')
      .addField('Invite this bot to your server:', 'https://discordapp.com/oauth2/authorize?client_id=593507058905645057&permissions=8&scope=bot')
      .addField('PolyCalculator\'s server link:', 'https://discord.gg/rtSTmd8')
      .addField('Documentation (How-to use the bot):', 'https://docs.polycalculatorbot.com')
      .addField('Website (Stats):', 'http://polycalculatorbot.com')

    return embed
  }
};