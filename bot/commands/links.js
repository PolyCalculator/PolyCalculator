module.exports = {
  name: 'links',
  description: 'show the link to invite the bot, to the developer\'s server and to the statistic\'s webiste.',
  aliases: ['link', 'inv', 'invite', 'server'],
  shortUsage(prefix) {
    return `${prefix}inv`
  },
  longUsage(prefix) {
    return `${prefix}link`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, args, embed) {
    embed.setColor('#FA8072')
      .setTitle('Links!')
      .addField('Invite to my server:', 'https://discordapp.com/oauth2/authorize?client_id=593507058905645057&permissions=8&scope=bot')
      .addField('Server link:', 'https://discord.gg/rtSTmd8')
      .addField('Documentation (How-to use the bot):', 'https://docs.polycalculatorbot.com')
      .addField('Website (Stats):', 'https://polycalculatorbot.com')
    return embed
  }
};