const dbServers = require('../util/dbServers')

module.exports = {
  name: 'removebotchannel',
  description: 'remove the pinged bot channel as a registered channel.\nA registered channel will prevent the bot\'s replies from auto-deleting.',
  aliases: ['rbc', 'rm'],
  shortUsage(prefix) {
    return `${prefix}rbc #bot-commands`
  },
  longUsage(prefix) {
    return `${prefix}removebotcchannel #bot-commands`
  },
  forceNoDelete: false,
  category: 'Settings',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    const channelToRemove = message.mentions.channels.first()

    try {
      if(channelToRemove) {
        const newBotChannelsArray = await dbServers.removeABotChannel(message.guild.id, channelToRemove.id, message.guild.name)
        let returnedArray
        if(newBotChannelsArray.length > 1) {
          returnedArray = '<#' + newBotChannelsArray.join('>,\n<#') + '>'

          return `The channel ${channelToRemove} was removed!\nHere's the new list of registered bot channels:\n` + returnedArray
        } else {
          return `There is no more registered bot command on this server anymore.\nYou can add more with \`${process.env.PREFIX}addbotchannel #bot-channel\` with the pinged channel you want to add!`
        }

      } else {
        const botChannelsArray = await dbServers.getBotChannels(message.guild.id, message.guild.name, '(removebotchannel cmd, no args)')
        const returnedArray = '<#' + botChannelsArray.join('>,\n<#') + '>'
        return 'You need to ping a channel to register it.\nHere are the current registered bot channels that won\'t auto-delete the commands:\n' + returnedArray
      }
    } catch(err) {
      throw err
    }
  }
};