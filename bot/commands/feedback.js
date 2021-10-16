const { buildEmbed } = require('../util/util')

module.exports = {
  name: 'feedback',
  description: 'send feedback to the dev!',
  aliases: ['feed', 'comments', 'comment', 'suggestion'],
  shortUsage(prefix) {
    return `${prefix}feedback`
  },
  longUsage(prefix) {
    return `${prefix}feedback`
  },
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, replyData, dbData) {
    if (argsStr.length < 1)
      throw 'Input your feedback after the command'

    const calcServer = message.client.guilds.cache.get('581872879386492929')
    const feedbackChannel = calcServer.channels.cache.get('738926248700411994')

    const feedbackData = { ...replyData }
    feedbackData.title = argsStr
    feedbackData.description = `From: ${message.author} (${message.author.tag})\n${message.url}`
    const embed = buildEmbed(feedbackData)

    feedbackChannel.send({ embeds: [embed] })
    feedbackChannel.send('<@217385992837922819>')

    replyData.content.push(['Feedback sent! :wave:', {}])

    return replyData
  }
};