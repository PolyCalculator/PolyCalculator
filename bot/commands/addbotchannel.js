const dbServers = require('../util/dbServers')

module.exports = {
  name: 'addbotchannel',
  description: 'add the pinged bot channel as a registered channel.\nA registered channel will prevent the bot\'s replies from auto-deleting.',
  aliases: ['abc', 'add'],
  shortUsage(prefix) {
    return `${prefix}abc #bot-commands`
  },
  longUsage(prefix) {
    return `${prefix}addbotcchannel #bot-commands`
  },
  forceNoDelete: true,
  category: 'Settings',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    const channelToAdd = message.mentions.channels.first()

    data.command = this.name
    data.attacker = undefined
    data.defender = undefined
    data.is_attacker_vet = undefined
    data.is_defender_vet = undefined
    data.attacker_description = undefined
    data.defender_description = undefined
    data.reply_fields = undefined

    try {
      if(channelToAdd) {
        const newBotChannelsArray = await dbServers.addABotChannel(message.guild.id, channelToAdd.id, message.guild.name)
        const returnedArray = '<#' + newBotChannelsArray.join('>,\n<#') + '>'
        return `The channel ${channelToAdd} was added!\nHere's the new list of registered bot channels:\n` + returnedArray
      } else {
        const botChannelsArray = await dbServers.getBotChannels(message.guild.id, message.guild.name, '(addbotchannel cmd, no args)')
        const returnedArray = '<#' + botChannelsArray.join('>,\n<#') + '>'
        return 'You need to ping a channel to register it.\nHere are the current registered bot channels that won\'t auto-delete the commands:\n' + returnedArray
      }
    } catch(err) {
      throw err
    }
  }
};