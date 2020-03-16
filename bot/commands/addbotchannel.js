const dbServers = require('../util/dbServers')

module.exports = {
  name: 'addbotchannel',
  description: 'add the pinged bot channel as a registered channel.\nA registered channel will prevent the bot\'s replies from auto-deleting.',
  aliases: ['abc'],
  shortUsage(prefix) {
    return `${prefix}abc #bot-commands`
  },
  longUsage(prefix) {
    return `${prefix}addbotcchannel #bot-commands`
  },
  category: 'Settings',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, args, embed) {
    const channelToAdd = message.mentions.channels.first()

    if(channelToAdd) {
      await dbServers.addABotChannel(message.guild.id, channelToAdd.id)
        .then(x => {

          const msg = ['The channel was added!\n', 'This is the updated list of registered bot channels:']
          x.forEach(y => {
            msg.push(message.guild.channels.get(y))
          })
          message.channel.send(msg)
        })
        .catch(x => {
          message.channel.send(x)
            .then()
        })
    }
    else {
      await dbServers.getBotChannels(message.guild.id)
        .then(x => {
          const msg = []
          if (x.length != 0) {
            msg.push('You need to ping a channel for it to be added.')
            msg.push('Here are the registered bot channels that won\'t auto-delete the commands:')
            x.forEach(y => {
              msg.push(message.guild.channels.get(y))
            })
          } else {
            msg.push('You don\'t yet have bot channels registered with me.')
            msg.push(`You can register them one by one using \`${process.env.PREFIX}addbotchannel\` with a channel ping!`)
          }
          message.channel.send(msg)
            .then().catch()
        })
        .catch(x => {message.channel.send(x).then().catch()})
    }
  },
};