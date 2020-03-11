module.exports = {
  name: 'addbotchannel',
  description: 'It adds the pinged bot channel as a registered channel.\nA registered channel will prevent the bot\'s replies from auto-deleting.',
  aliases: ['abc'],
  shortUsage(prefix) {
    return `${prefix}abc #bot-commands`
  },
  longUsage(prefix) {
    return `${prefix}addbotcchannel #bot-commands`
  },
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819'],
  betabotID: '600161946867597322',
  noStatsBot: '660136237725777955',
  execute: async function(message, stats, db) {
    console.log('this.permsAllowed:', this.permsAllowed)
    const perms = this.permsAllowed.some(x => message.member.hasPermission(x))
    const meee = this.usersAllowed.some(() => message.author.id)
    if (!perms && !meee)
      return message.channel.send('Only an admin can modify the registerd bot channels, sorry!')

    const channelToAdd = message.mentions.channels.first()

    if (message.channel.id != this.noStatsBot || message.client.user.id != this.betabotID)
      stats.addStats(message.cleanContent, message.author.id, this.name, message.url, '', message.guild.id)
        .then()
        .catch(errorMsg => {
          errorMsg = errorMsg.toString()
          errorChannel.send(errorMsg.concat(', ', `${meee}!`))
            .then()
            .catch()
        })

    if(channelToAdd) {
      await db.addABotChannel(message.guild.id, channelToAdd.id)
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
      await db.getBotChannels(message.guild.id)
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
            msg.push(`You can register them one by one using \`${prefix}addbotchannel\` with a channel ping!`)
          }
          message.channel.send(msg)
            .then()
        })
        .catch(x => {message.channel.send(x).then()})
    }
  },
};