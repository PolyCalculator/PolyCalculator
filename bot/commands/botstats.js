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
  execute: function(message, argsStr, embed, trashEmoji, data) {
    const description = []
    message.channel.send(`Total de serveurs: ${message.client.guilds.cache.size}`)
    const serverMap = message.client.guilds.cache.array()
    serverMap.sort((a, b) => {
      if(a.me.joinedTimestamp < b.me.joinedTimestamp)
        return -1
      if(a.me.joinedTimestamp < b.me.joinedTimestamp)
        return 1

      return 0
    })
    serverMap.forEach((x) => {
      if(description.toString().length > 1900)
        embed.addField(`**${x.name}** (${x.id})`, `${x.owner.user.tag} => ${x.memberCount}`)
      else
        description.push(`**${x.name}** (${x.id}) ${x.owner.user.tag} => ${x.memberCount}`)
    })

    embed.setDescription(description)
    return embed
  },
};