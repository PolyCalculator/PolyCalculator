module.exports = {
  name: 'pingusers',
  description: 'ping every user with at least 100 uses.',
  aliases: [],
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
  // eslint-disable-next-line no-unused-vars
  execute(message, argsStr, embed, willDelete) {
    if(!argsStr)
      throw 'You need to include a message...'

    message.client.guilds.forEach((x) => {
      const owner = x.owner.user
      owner.send(argsStr).then().catch(console.error)
    })
  }
};