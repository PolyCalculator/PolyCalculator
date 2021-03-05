require('dotenv').config()
const { Client, Collection } = require('discord.js')
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const fs = require('fs')
const prefix = process.env.PREFIX
const help = require('./commands/help')
const { buildEmbed, saveStats, logUse, milestoneMsg } = require('./util/util')
const db = require('../db')
let calcServer = {}
let meee = {}
let newsChannel = {}
let logChannel = {}
let errorChannel = {}

// bot.commands as a collection(Map) of commands from ./commands
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'))
bot.commands = new Collection()
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  bot.commands.set(command.name, command)
}

const dbServers = require('./util/dbServers')

// --------------------------------------
//
//       EVENT ON LOGIN
//
// --------------------------------------
bot.once('ready', () => {
  calcServer = bot.guilds.cache.get('581872879386492929')
  meee = bot.users.cache.get('217385992837922819')
  newsChannel = calcServer.channels.cache.get('654168953643466752')
  logChannel = calcServer.channels.cache.get('648688924155314176')
  errorChannel = calcServer.channels.cache.get('658125562455261185')
  let toggle = true

  setInterval(function () {
    if (toggle) {
      bot.user.setActivity(`${prefix}units`, { type: 'PLAYING' })
      toggle = false
    } else {
      bot.user.setActivity(`${prefix}help c`, { type: 'PLAYING' })
      toggle = true
    }
  }, 10000);

  // eslint-disable-next-line no-console
  console.log(`Logged in as ${bot.user.username}`)
});

// --------------------------------------
//
//      EVENT ON MESSAGE
//
// --------------------------------------
bot.on('message', async message => {
  if (message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
    return

  // If it's a DM
  if (message.channel.type === 'dm') {
    const logMsg = []
    logMsg.push(`Content: ${message.content}`)
    logMsg.push(`DM from ${message.author} (${message.author.username})`)
    logMsg.push(`${meee}`)

    message.channel.send(`I do not support DM commands.\nYou can go into any server I'm in and do \`${prefix}help c\` for help with my most common command.\nFor more meta discussions, you can find the PolyCalculator server with \`${prefix}links\` in any of those servers!`)
      .catch(console.error)
    return logChannel.send(logMsg).catch(console.error)
  }

  // BOOLEAN for if the channel is registered as a bot channel in the bot
  let isNotBotChannel = true
  dbServers.isRegisteredChannel(message.guild.id, message.channel.id)
    .then(x => isNotBotChannel = !x).catch(console.error)

  const textStr = message.cleanContent.slice(prefix.length)
  const commandName = textStr.split(/ +/).shift().toLowerCase();
  const argsStr = textStr.slice(commandName.length + 1)

  // Map all the commands
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Return if the command doesn't exist
  if (!command)
    return

  const trashEmoji = isNotBotChannel && !command.forceNoDelete
  const generalDelete = { timeout: 5000 }

  // DATA FOR DATABASE
  const dbData = {
    command: command.name,
    content: message.cleanContent.slice(process.env.PREFIX.length),
    author_id: message.author.id,
    author_tag: message.author.tag,
    server_id: message.guild.id,
    arg: argsStr,
    will_delete: trashEmoji,
    message_id: message.id
  }
  const replyData = {
    content: [],
    deleteContent: false,
    discord: {
      title: undefined,
      description: undefined,
      fields: [],
      footer: undefined
    },
    outcome: {
      attackers: [],
      // {
      //    name
      //    beforehp: 0,
      //    maxhp: 40,
      //    hplost: 0,
      //    hpdefender: 0
      // }
      defender: {
        // name: '',
        // currenthp: 0,
        // maxhp: 40,
        // hplost: 0,
      }
    }
  }

  if (argsStr.includes('help')) {
    const reply = help.execute(message, command.name, replyData, dbData, trashEmoji)
    const helpEmbed = buildEmbed(reply)

    return message.channel.send(helpEmbed)
      .then(x => {
        x.react('🗑️').then().catch(console.error)
      }).catch(console.error)
  }

  // Warning when channel name includes general and delete both messages
  if (message.channel.name.includes('general') && message.author.id != meee.id)
    return message.channel.send(`Come on! Not in #**${message.channel.name}**`)
      .then(x => {
        x.delete(generalDelete).then().catch(console.error)
        message.delete(generalDelete).then().catch(console.error)
      }).catch(console.error)

  // Check if command is allowed in that channel
  if (command.channelsAllowed) { // Certain commands can only be triggered in specific channels
    if (!(command.channelsAllowed && command.channelsAllowed.some(x => x === message.channel.id)))
      return
  }

  // Check if the user has the permissions necessary to execute the command
  if (!(command.permsAllowed !== 'VIEW_CHANNEL' || command.permsAllowed.some(x => message.member.hasPermission(x)) || command.usersAllowed.some(x => x === message.author.id)))
    return message.channel.send('Only an admin can use this command, sorry!')

  try {
    // EXECUTE COMMAND
    const replyObj = await command.execute(message, argsStr, replyData, dbData, trashEmoji)

    logUse(message, logChannel)

    replyObj.content.forEach(async other => {
      if (typeof other[0] === 'object')
        other[0] = buildEmbed(other[0])
      const warnings = await message.channel.send(other[0], other[1])
      if (replyObj.deleteContent)
        warnings.delete({ timeout: 15000 })
    })

    if (replyObj.discord.description === undefined && replyObj.discord.title === undefined && replyObj.discord.fields.length === 0)
      return

    const msg = buildEmbed(replyObj)

    const replyMessage = await message.channel.send(msg)
    dbData.url = replyMessage.url
    if (trashEmoji)
      replyMessage.react('🗑️').then().catch(console.error)

    // INSERT INTO DB
    saveStats(dbData, db)

    milestoneMsg(message, db, newsChannel, meee)

    return
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    if (error.stack)
      errorChannel.send(`**${message.cleanContent}** by ${message.author} (@${message.author.tag})\n${error}\n${message.url}`)

    return message.channel.send(`${error}`)
      .then().catch(console.error)
  }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  let triggerMessage
  try {
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.partial) await reaction.fetch();

    if (user.bot)
      return

    if (reaction.message.author.id !== bot.user.id)
      return

    if (reaction.emoji.name !== '🗑️')
      return

    const sql = 'SELECT author_id AS id, message_id FROM stats WHERE url = $1'
    const values = [reaction.message.url]
    const returned = await db.query(sql, values)
    let isUserRemoved = false

    if (returned.rows[0]) {
      triggerMessage = await reaction.message.channel.messages.fetch(returned.rows[0].message_id)
      isUserRemoved = true && returned.rows[0].id === user.id
    }

    const memberRemoving = reaction.message.guild.member(user.id)
    const canDelete = memberRemoving.hasPermission('MANAGE_MESSAGES') && reaction.me

    if (isUserRemoved || user.id === meee.id || canDelete) {
      reaction.message.delete()
        .then().catch(console.error)
      if (triggerMessage)
        triggerMessage.delete()
          .then().catch(console.error)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    if (error.stack && triggerMessage)
      errorChannel.send(`**${triggerMessage.cleanContent}** by ${triggerMessage.author} (@${triggerMessage.author.tag})\n${error.stack}\n${triggerMessage.url}`)
    else {
      const pathArray = error.path.split('/')
      errorChannel.send(`${error.message},\n<#${pathArray[2]}>`)
    }
  }
})

// --------------------------------------
//
//    EVENT ON CHANNEL DELETE
//
// --------------------------------------
bot.on('channelDelete', deletedChannel => {
  dbServers.getBotChannels(deletedChannel.guild.id, deletedChannel.guild.name, '(channelDelete)')
    .then(x => { // x = array of bot channels
      if (x.some(y => y === deletedChannel.id))
        dbServers.removeABotChannel(deletedChannel.guild.id, deletedChannel.id, deletedChannel.guild.name)
          .then().catch(errorMsg => {
            errorChannel.send(`${errorMsg}\n${deletedChannel.channel.name} in ${deletedChannel.guild.name} (${deletedChannel.guild.id})\n${meee}!`)
              .then().catch(console.error)
          })
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log(err.stack || err)
    })
})
// --------------------------------------
//
//    EVENT ON CHANNEL CREATE
//
// --------------------------------------
bot.on('channelCreate', createdChannel => {
  if (createdChannel.type != 'text')
    return

  if (createdChannel.name.includes('bot') || createdChannel.name.includes('command'))
    dbServers.addABotChannel(createdChannel.guild.id, createdChannel.id, createdChannel.guild.name)
      .then().catch(errorMsg => {
        errorChannel.send(`${errorMsg}\n${createdChannel.channel.name} in ${createdChannel.guild.name} (${createdChannel.guild.id})\n${meee}!`)
          .then().catch()
      })
})
// --------------------------------------
//
//     EVENT ON NEW GUILD JOIN
//
// --------------------------------------
bot.on('guildCreate', guild => {
  let botChannels = []
  const botChannelsMap = guild.channels.cache.filter(x => (x.name.includes('bot') || x.name.includes('command')) && x.type === 'text')
  if (botChannelsMap.size > 0)
    botChannels = botChannelsMap.keys()

  dbServers.addNewServer(guild.id, guild.name, botChannels)
    .then(logMsg => {
      logChannel.send(`${logMsg}, ${meee}`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(`${errorMsg}, ${meee}`)
        .then().catch(console.error)
    })
  return
})
// --------------------------------------
//
//      EVENT ON REMOVE GUILD JOIN
//
// --------------------------------------
bot.on('guildDelete', guild => {
  dbServers.removeServer(guild.id, guild.name)
    .then(logMsg => {
      logChannel.send(`${logMsg}, ${meee}`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(`${errorMsg}, ${meee}`)
        .then().catch(console.error)
    })
  return
})

// --------------------------------------
//
//  EVENT ON NEW MEMBER IN DEV SERVER
//
// --------------------------------------
bot.on('guildMemberAdd', newMember => {
  if (newMember.guild.id === '581872879386492929') {
    newMember.roles.add('654164652741099540')
      .then(x => {
        // eslint-disable-next-line no-console
        console.log(`${x.user.tag} just got in PolyCalculator server!`)
      }).catch(console.error)
  }
})

process.on('unhandledRejection', (code) => {
  // eslint-disable-next-line no-console
  console.log(`unhandledRejection: ${code.stack}`)
  errorChannel.send(`unhandledRejection: ${code.stack}`)
})

bot.login(process.env.TOKEN);