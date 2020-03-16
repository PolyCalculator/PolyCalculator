module.exports = {
  name: 'pingowners',
  description: 'ping every owner.',
  aliases: ['ping'],
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
  execute(message, args, embed) {
    args = args.slice(this.name.length)
    if(!args)
      throw 'You need to include a message...'

    message.client.guilds.forEach((x) => {
      const owner = x.owner.user
      owner.send(args).then().catch(console.error)
    })
  },
};