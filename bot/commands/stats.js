module.exports = {
  name: 'stats',
  description: 'show stats.',
  aliases: ['stat'],
  shortUsage() {
    return undefined
  },
  longUsage() {
    return undefined
  },
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  channelsAllowed: ['595323493558517780'],
  execute(message, args, embed) {
    let i = 0;
    message.channel.send(`Total de serveurs: ${message.client.guilds.size}`)
    message.client.guilds.forEach((x) => {
      embed.addField(`**${x.name}** (${x.id}):`, `${x.owner.user} ${x.owner.user.tag}\n-Number of members: ${x.memberCount}\n-Number of channels: ${x.channels.size}\n`)
      i = i + 1;
    })
    return embed
  },
};