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
  execute: function (message, argsStr, replyData, dbData) {
    const description = []
    replyData.content.push([`Total de serveurs: ${message.client.guilds.cache.size}`, {}])
    const serverMap = message.client.guilds.cache.array()
    serverMap.sort((a, b) => {
      if (a.me.joinedTimestamp < b.me.joinedTimestamp)
        return -1
      if (a.me.joinedTimestamp < b.me.joinedTimestamp)
        return 1

      return 0
    })
    serverMap.forEach((x) => {
      if (description.toString().length > 1900)
        replyData.fields.push({ name: `**${x.name}** (${x.id})`, value: `${x.owner.user} ${x.owner.user.tag} => ${x.memberCount}` })
      else
        description.push(`**${x.name}** (${x.id}) ${x.owner.user} ${x.owner.user.tag} => ${x.memberCount}`)
    })

    replyData.description = description
    return replyData
  },
};