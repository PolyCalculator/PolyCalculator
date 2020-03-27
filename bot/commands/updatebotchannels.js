const dbServers = require('../util/dbServers')

module.exports = {
  name: 'updatebotchannels',
  description: 'resets the bot channels to the channels containing \'bot\' or ',
  aliases: ['ubc', 'up'],
  shortUsage(prefix) {
    return `${prefix}up 581872879386492929`
  },
  longUsage(prefix) {
    return `${prefix}updatebotchannels 581872879386492929`
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  channelsAllowed: ['595323493558517780'],
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed, willDelete) {
    if(!argsStr)
      throw 'You need to specify a server id'
    if(argsStr.length != 18) {
      throw 'Looks like an invalid server id :thinking:...'
    }
    if(!message.client.guilds.get(argsStr))
      throw 'Doesn\'t look I\'m in that server (yet?)'

    try {
      const guild = message.client.guilds.get(argsStr)
      const newBotChannelsArray = await dbServers.updateBotChannels(guild)
      const returnedArray = '<#' + newBotChannelsArray.join('>,\n<#') + '>'
      return `The channels for **${guild.name}** were reset to:\n` + returnedArray
    } catch (err) {
      throw err
    }
  }
}