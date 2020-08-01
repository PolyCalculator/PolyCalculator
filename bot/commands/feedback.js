module.exports = {
  name: 'feedback',
  description: 'send feedback to the dev!',
  aliases: ['feed'],
  shortUsage(prefix) {
    return `${prefix}feed`
  },
  longUsage(prefix) {
    return `${prefix}feedback`
  },
  forceNoDelete: false,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, embed) {
    const calcServer = message.client.guilds.cache.get('581872879386492929')
    const feedbackChannel = calcServer.channels.cache.get('738926248700411994')

    feedbackChannel.send(`${argsStr}, <@217385992837922819>\nFrom: ${message.author} (${message.author.tag})`)

    return 'Feedback sent! :wave:'
  }
};