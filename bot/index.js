require('dotenv').config();
const { Client, MessageEmbed, Collection } = require('discord.js');
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs')
const prefix = process.env.PREFIX
const help = require('./commands/help')
const db = require('../db')
let calcServer = {}
let meee = {}
let newsChannel = {}
let logChannel = {}
let errorChannel = {}

// bot.commands as a collection(Map) of commands from ./commands
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
bot.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

const dbServers = require('./util/dbServers');
// const unitList = require('./util/unitsList')

// --------------------------------------
//
//       EVENT ON LOGIN
//
// --------------------------------------
bot.once('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${bot.user.username}`);

  calcServer = bot.guilds.cache.get('581872879386492929')
  meee = bot.users.cache.get('217385992837922819')
  newsChannel = calcServer.channels.cache.get('654168953643466752')
  logChannel = calcServer.channels.cache.get('648688924155314176')
  errorChannel = calcServer.channels.cache.get('658125562455261185')
  let toggle = true

  setInterval(function() {
    if(toggle) {
      bot.user.setActivity(`${prefix}links`, { type: 'PLAYING' })
      toggle = false
    } else {
      bot.user.setActivity(`${prefix}help c`, { type: 'PLAYING' })
      toggle = true
    }
  }, 10000);

  if(bot.user.id != process.env.BETABOT_ID)
    logChannel.send(`Logged in as ${bot.user.username}, ${meee}`)
});

// --------------------------------------
//
//      EVENT ON MESSAGE
//
// --------------------------------------
bot.on('message', async message => {
  if(message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
    return

  const logEmbed = new MessageEmbed().setColor('#ff0066')
  // If it's a DM
  if(message.channel.type === 'dm') {
    logEmbed
      .addField('DM from', message.author)
      .addField('Content:', `${message.content}`)
    message.channel.send(`I do not support DM commands.\nYou can go into any server I'm in and do \`${prefix}help c\` for help with my most common command.\nFor more meta discussions, you can find the PolyCalculator server with \`${prefix}links\` in any of those servers!`)
      .then().catch(console.error)
    logChannel.send(logEmbed).then().catch(console.error)
    return logChannel.send(`${meee}`).then().catch(console.error)
  }

  // BOOLEAN for if the channel is registered as a bot channel in the bot
  let isNotBotChannel = true
  await dbServers.isRegisteredChannel(message.guild.id, message.channel.id)
    .then(x => isNotBotChannel = !x).catch(console.error)

  const textStr = message.cleanContent.slice(prefix.length)
  const commandName = textStr.split(/ +/).shift().toLowerCase();
  const argsStr = textStr.slice(commandName.length + 1)

  // Map all the commands
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Return if the command doesn't exist
  if (!command)
    return

  // Instantiate the embed that's sent to every command execution
  const embed = new MessageEmbed().setColor('#ff0066')

  const trashEmoji = isNotBotChannel && !command.forceNoDelete
  const generalDelete = { timeout: 5000 }
  const failDelete = { timeout: 15000 }

  if(argsStr.includes('help')) {
    help.execute(message, command.name, embed, trashEmoji)
    return message.channel.send(embed)
      .then(x => {
        x.react('🗑️').then().catch(console.error)
        message.delete().then().catch(console.error)
      }).catch(console.error)
  }

  // Warning when channel name includes general and delete both messages
  if(message.channel.name.includes('general') && message.author.id != meee.id)
    return message.channel.send(`Come on! Not in #**${message.channel.name}**`)
      .then(x => {
        x.delete(generalDelete).then().catch(console.error)
        message.delete(generalDelete).then().catch(console.error)
      }).catch(console.error)

  // Check if command is allowed in that channel
  if(command.channelsAllowed) { // Certain commands can only be triggered in specific channels
    if(!(command.channelsAllowed && command.channelsAllowed.some(x => x === message.channel.id)))
      return
  }

  // Check if the user has the permissions necessary to execute the command
  if(!(command.permsAllowed !== 'VIEW_CHANNEL' || command.permsAllowed.some(x => message.member.hasPermission(x)) || command.usersAllowed.some(x => x === message.author.id)))
    return message.channel.send('Only an admin can use this command, sorry!')

  try {
    // DATA FOR DATABASE
    const data = {
      command: command.name,
      content: message.cleanContent.slice(process.env.PREFIX.length),
      author_id: message.author.id,
      author_tag: message.author.tag,
      server_id: message.guild.id,
      arg: argsStr,
      will_delete: trashEmoji,
      message_id: message.id
    }

    // EXECUTE COMMAND
    const reply = await command.execute(message, argsStr, embed, trashEmoji, data);

    // Log the command
    if(message.cleanContent.length <= 256 && message.cleanContent.length >= 0) {
      logEmbed.setTitle(`**${message.cleanContent}**`)
        .setDescription(` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`)
      logChannel.send(logEmbed)
        .then().catch(console.error)
    }
    if(reply) {
      const replyMessage = await message.channel.send(reply)
      data.url = replyMessage.url
      if(trashEmoji)
        replyMessage.react('🗑️').then().catch(console.error)
    }

    // INSERT INTO DB
    if(bot.user.id !== '600161946867597322' || !message.channel.name.startsWith('bot-test')) {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, url, message_id, server_id, will_delete, attacker_description, defender_description, reply_fields, arg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
      const values = [data.content, data.author_id, data.author_tag, data.command, data.attacker, data.defender, data.url, data.message_id, data.server_id, data.will_delete, data.attacker_description, data.defender_description, data.reply_fields, data.arg]
      await db.query(sql, values)
    }

    let { rows } = await db.query('SELECT COUNT(st.id) AS "triggers" FROM stats st JOIN servers se ON se.server_id = st.server_id')

    rows = rows[0]
    rows.triggers = parseInt(rows.triggers)

    if(rows.triggers % 5000 === 0) {
      newsChannel.send(`<:yay:585534167274618997>:tada: We reached ${rows.triggers} uses! :tada:<:yay:585534167274618997>`)
      meee.send(`<:yay:585534167274618997>:tada: We're at **${rows.triggers}** uses! :tada:<:yay:585534167274618997>`)
    }

    return
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    errorChannel.send(`**${message.cleanContent}** by ${message.author} (@${message.author.tag})\n${error}\n${message.url}`)
    return message.channel.send(`${error}`)
      .then(x => {
        if(trashEmoji) {
          x.delete(failDelete).then().catch(console.error)
          message.delete(failDelete).then().catch(console.error)
        }
      }).catch(console.error)
  }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  if(reaction.message.partial) await reaction.message.fetch();

  if(reaction.partial) await reaction.fetch();

  if(user.id === bot.user.id || reaction.message.author.id !== bot.user.id)
    return

  const sql = 'SELECT author_id AS id, message_id FROM stats WHERE url = $1'
  const values = [reaction.message.url]
  const returned = await db.query(sql, values)
  let triggerMessage

  if(returned.rows[0])
    triggerMessage = await reaction.message.channel.messages.fetch(returned.rows[0].message_id)
  else
    return

  if(returned.rows[0].id === user.id || user.id === meee.id) {
    reaction.message.delete()
      .then().catch(console.error)
    if(triggerMessage)
      triggerMessage.delete()
        .then().catch(console.error)
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
      if(x.some(y => y === deletedChannel.id))
        dbServers.removeABotChannel(deletedChannel.guild.id, deletedChannel.id, deletedChannel.guild.name)
          .then().catch(errorMsg => {
            errorChannel.send(`${errorMsg}\n${deletedChannel.channel.name} in ${deletedChannel.guild.name} (${deletedChannel.guild.id})\n${meee}!`)
              .then().catch(console.error)
          })
    }).catch(errorMsg => {
      errorChannel.send(`${errorMsg}\n in ${deletedChannel.guild.name} (${deletedChannel.guild.id})\n${meee}!`)
        .then().catch(console.error)
    })
})
// --------------------------------------
//
//    EVENT ON CHANNEL CREATE
//
// --------------------------------------
bot.on('channelCreate', createdChannel => {
  if(createdChannel.type != 'text')
    return

  if(createdChannel.name.includes('bot') || createdChannel.name.includes('command'))
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
  if(botChannelsMap.size > 0)
    botChannels = botChannelsMap.keys()

  dbServers.addNewServer(guild.id, guild.name, botChannels, meee)
    .then(logMsg => {
      logChannel.send(logMsg)
        .then().catch(console.error)
      logChannel.send(`${meee}`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(errorMsg)
        .then().catch(console.error)
      errorChannel.send(`${meee}`)
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
      logChannel.send(logMsg)
        .then().catch(console.error)
      logChannel.send(`${meee}`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(errorMsg)
        .then().catch(console.error)
      errorChannel.send(`${meee}`)
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
  if(newMember.guild.id === '581872879386492929') {
    newMember.roles.add('654164652741099540')
      .then(x => {
        // eslint-disable-next-line no-console
        console.log(`${x.user.tag} just got in PolyCalculator server!`)
      }).catch(console.error)
  }
})

// --------------------------------------
//        END/OTHER
// --------------------------------------
setInterval(function() {

}, 3600000); // every 1h (3600000) 3h (10800000) 6h (21600000)

process.on('unhandledRejection', (code) => {
  // eslint-disable-next-line no-console
  console.log(`unhandledRejection: ${code.stack}`)
  errorChannel.send(`unhandledRejection: ${code.stack}`)
})

bot.login(process.env.TOKEN);