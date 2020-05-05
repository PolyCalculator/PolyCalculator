module.exports = {
  name: 'botstats',
  description: 'show stats.',
  aliases: ['botstat', 'bot'],
  shortUsage() {
    return undefined
  },
  longUsage() {
    return undefined
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  channelsAllowed: ['595323493558517780'],
  // eslint-disable-next-line no-unused-vars
  execute(message, argsStr, embed, willDelete) {
    let i = 0;
    message.channel.send(`Total de serveurs: ${message.client.guilds.cache.size}`)
    message.client.guilds.cache.forEach((x) => {
      embed.addField(`**${x.name}** (${x.id}):`, `${x.owner.user} ${x.owner.user.tag}\n-Number of members: ${x.memberCount}\n-Number of channels: ${x.channels.size}\n`)
      i = i + 1;
    })
    return embed
  },
};