module.exports.transferMessage = function (message, crawServer) {
  if (!crawServer)
    return

  const channelA = crawServer.channels.cache.get(crawAnnouncements)

  if (announcementChannels.some(x => x === message.channel.id))
    channelA.send(`**${message.guild.name} #${message.channel.name}**\n\`\`\`${message.createdAt.toUTCString()}\`\`\`\n${message.cleanContent}`, { files: message.attachments.array() })
  else if (message.id === pickFatCount)
    channelA.send(`**${message.guild.name} #${message.channel.name}**\n\`\`\`${message.editedAt.toUTCString()}\`\`\`\n${message.cleanContent}`)
}

const crawAnnouncements = '747198636495994910'

const announcementChannels = [
  '447986488152686594', // server-announcements
  '488572469666512896', // league-updates
  '722958026885169163', // league-stats
  '688810283900469279', // draft-selection
  '689873462118187017' // free-agent-picks
]

const pickFatCount = '714204768289030214'

