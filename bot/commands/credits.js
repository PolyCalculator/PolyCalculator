module.exports = {
  name: 'credits',
  description: 'show the team!',
  aliases: ['cred', 'credit'],
  shortUsage(prefix) {
    return this.longUsage(prefix)
  },
  longUsage(prefix) {
    return `${prefix}credits`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, args, embed) {
    embed.setColor('#FA8072')
      .setTitle('PolyCalculator\'s server')
      .setDescription('For bot updates, feature requests and bug reports')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'penile partay, WOPWOP, Cake, James, LiNoKami.')
      .setURL('https://discord.gg/rtSTmd8')
    return embed
  }
};