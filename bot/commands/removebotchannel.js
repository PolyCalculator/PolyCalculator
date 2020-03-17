const dbServers = require('../util/dbServers')

module.exports = {
  name: 'removebotchannel',
  description: 'remove the pinged bot channel as a registered channel.\nA registered channel will prevent the bot\'s replies from auto-deleting.',
  aliases: ['rbc'],
  shortUsage(prefix) {
    return `${prefix}rbc #bot-commands`
  },
  longUsage(prefix) {
    return `${prefix}removebotcchannel #bot-commands`
  },
  category: 'Settings',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute(message, argsStr, embed) {
    return 0
  },
};