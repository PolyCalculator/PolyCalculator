module.exports = {
  name: 'pingowners',
  description: 'ping every owner.',
  aliases: [],
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
    if(!argsStr)
      throw 'You need to include a message...'

    message.client.guilds.cache.forEach((x) => {
      const owner = x.owner.user
      owner.send(argsStr).then().catch(console.error)
    })
  }
};