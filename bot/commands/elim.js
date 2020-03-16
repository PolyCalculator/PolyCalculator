const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'elim',
  description: 'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).',
  aliases: ['e'],
  shortUsage(prefix) {
    return 'This command is too complicated to show an example. Try `.help elim`'
  },
  longUsage(prefix) {
    return `\`${prefix}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`
  },
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, args, embed) {
    if(args.length === 0)
      throw 'try `.help e` for more information on how to use this command!'



    if(attackerArray.some(x => x.includes('?')) && defenderArray.some(x => x.includes('?'))) {
      message.channel.send('*Note that any hp input will be disregarded.*')
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)

      if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent.slice(prefix.length).toLowerCase(), message.author, cmd, message.url, resEmbed, message.guild.id)
          .then()
          .catch(errorMsg => {
            errorMsg = errorMsg.toString()
            errorChannel.send(errorMsg.concat(', ', `${meee}!`))
              .then()
              .catch()
          })

      message.channel.send(result.provideDefHP())
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)

      message.channel.send(result.provideAttHP())
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
    } else if(attackerArray.some(x => x.includes('?'))) {
      if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent.slice(prefix.length).toLowerCase(), message.author, cmd, message.url, resEmbed, message.guild.id)
          .then()
          .catch(errorMsg => {
            errorMsg = errorMsg.toString()
            errorChannel.send(errorMsg.concat(', ', `${meee}!`))
              .then()
              .catch()
          })
      message.channel.send(result.provideDefHP())
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
    } else if(defenderArray.some(x => x.includes('?'))) {
      if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent.slice(prefix.length).toLowerCase(), message.author, cmd, message.url, resEmbed, message.guild.id)
          .then()
          .catch(errorMsg => {
            errorMsg = errorMsg.toString()
            errorChannel.send(errorMsg.concat(', ', `${meee}!`))
              .then()
              .catch()
          })
      message.channel.send(result.provideAttHP())
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
    } else
      message.channel.send(`You are either missing a \`?\` to display the most optimal hp to eliminate units.\n\`${prefix}help e\` for more information.\n\nOr you are looking for the basic \`${prefix}c\` command.\n\`${prefix}help c\` for more information.`)
        .then(x => {
          if(!botChannel.some(y => y === message.channel.id)) {
            x.delete(60000)
              .then()
              .catch(console.error)
            message.delete(60000)
              .then(() => {
                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                console.log(`Message deleted in ${message.channel.name} after 1 min`)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
  }
};