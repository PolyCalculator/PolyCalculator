require('dotenv').config()
const { Client, Collection } = require('discord.js')
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] })
const fs = require('fs')
const prefix = process.env.PREFIX
const help = require('./commands/help')
const { buildEmbed, saveStats, logUse, logInteraction, milestoneMsg, makeSlashAlt } = require('./util/util')
const db = require('../db')
let calcServer = {}
let newsChannel = {}
let logChannel = {}
let errorChannel = {}

bot.commands = new Collection()
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'))

bot.interactions = new Collection();
const interactionFiles = fs.readdirSync('./bot/interactions').filter(file => file.endsWith('.js') && !file.endsWith('index.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  bot.commands.set(command.name, command)
}

for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);
  bot.interactions.set(interaction.data.name, interaction);
}

const dbServers = require('./util/dbServers')

// --------------------------------------
//
//       EVENT ON LOGIN
//
// --------------------------------------
bot.once('ready', () => {
  calcServer = bot.guilds.cache.get('581872879386492929')
  newsChannel = calcServer.channels.cache.get('654168953643466752')
  logChannel = calcServer.channels.cache.get('648688924155314176')
  errorChannel = calcServer.channels.cache.get('658125562455261185')
  let toggle = true

  setInterval(function() {
    if (toggle) {
      bot.user.setActivity('/units', { type: 'PLAYING' })
      toggle = false
    } else {
      bot.user.setActivity('/help calc', { type: 'PLAYING' })
      toggle = true
    }
  }, 10000);

  // eslint-disable-next-line no-console
  console.log(`Logged in as ${bot.user.username}`)
});

// --------------------------------------
//
//      EVENT ON SLASH
//
// --------------------------------------
bot.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const commandInteraction = bot.interactions.get(interaction.commandName);

  if (!commandInteraction) return;

  // DATA FOR DATABASE
  const dbData = {
    command: interaction.commandName,
    author_id: interaction.user.id,
    author_tag: interaction.user.tag,
    server_id: interaction.guild.id,
    will_delete: true,
    message_id: interaction.id,
    isSlash: true,
  }
  let replyData = {
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

  try {
    replyData = await commandInteraction.execute(interaction, replyData, dbData);

    const embed = buildEmbed(replyData)

    const options = {
      embeds: [embed],
      fetchReply: true
    }

    if (replyData.content.length !== 0)
      options.content = replyData.content.join('\n')

    const interactionResponse = await interaction.reply(options);
    // const interactionResponse = await interaction.reply({ embeds: [embed], fetchReply: true });

    dbData.url = interactionResponse.url
    interactionResponse.react('🗑️').then().catch(console.error)
    // interactionResponse.edit({ embeds: [embed] })

    logInteraction(interaction, logChannel, interactionResponse)

    saveStats(dbData, db)

    milestoneMsg(interaction, db, newsChannel)
  } catch (error) {
    console.error(error);
    await interaction.reply(`${error.message ? `${error.message}: ${error.name}` : error}`)//{ content: 'There was an error while executing this command!'/*, ephemeral: true */ });
  }
});

// --------------------------------------
//
//      EVENT ON MESSAGE
//
// --------------------------------------
bot.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
    return

  // If it's a DM
  if (message.channel.type === 'dm') {
    const logMsg = []
    logMsg.push(`Content: ${message.content}`)
    logMsg.push(`DM from ${message.author}(${message.author.username})`)
    logMsg.push('<@217385992837922819>')

    message.channel.send('I do not support DM commands.\nYou can go into any server I\'m in and do `/help c` for help with my most common command.\nFor more meta discussions, you can find the PolyCalculator server with `/links` in any of those servers!')
      .catch(console.error)
    return logChannel.send(logMsg).catch(console.error)
  }

  const textStr = message.cleanContent.slice(prefix.length)
  const commandName = textStr.split(/ +/).shift().toLowerCase();
  const argsStr = textStr.slice(commandName.length + 1)

  // Map all the commands
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Return if the command doesn't exist
  if (!command)
    return

  const generalDelete = { timeout: 5000 }

  // DATA FOR DATABASE
  const dbData = {
    command: command.name,
    content: message.cleanContent.slice(process.env.PREFIX.length),
    author_id: message.author.id,
    author_tag: message.author.tag,
    server_id: message.guild.id,
    arg: argsStr,
    will_delete: true,
    message_id: message.id,
    isSlash: false
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
    const reply = help.execute(message, command.name, replyData, dbData)
    const helpEmbed = buildEmbed(reply)

    return message.channel.send({ embeds: [helpEmbed] })
      .then(x => {
        x.react('🗑️').then().catch(console.error)
      }).catch(console.error)
  }

  // Warning when channel name includes general and delete both messages
  if (message.channel.name.includes('general') && message.author.id != '217385992837922819')
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
  if (!(command.permsAllowed !== 'VIEW_CHANNEL' || command.permsAllowed.some(x => message.member.permissions.has(x)) || command.usersAllowed.some(x => x === message.author.id)))
    return message.channel.send('Only an admin can use this command, sorry!')

  try {
    // EXECUTE COMMAND
    const replyObj = await command.execute(message, argsStr, replyData, dbData)

    logUse(message, logChannel)

    replyObj.content.forEach(async other => {
      const warnings = await message.channel.send(other[0])

      if (replyObj.deleteContent)
        warnings.delete({ timeout: 15000 })
    })

    if (replyObj.discord.description === undefined && replyObj.discord.title === undefined && replyObj.discord.fields.length === 0)
      return

    const msg = buildEmbed(replyObj)

    const replyMessage = await message.channel.send({ embeds: [msg] })
    dbData.url = replyMessage.url

    replyMessage.react('🗑️').then().catch(console.error)

    if (command.name === 'calc' || command.name === 'optim') {
      const slashMessage = await message.channel.send(':mega::mega::mega: ```\nSoon, I will only support /slash commands. Here\'s what your command would look like in /slash commands, just copy and paste it again\n(if it doesn\'t work on the first try, paste again and add a space before you hit enter)\n```:mega::mega::mega:')
      await message.channel.send(makeSlashAlt(command, argsStr))
      setTimeout(function() { slashMessage.delete() }, 120000)
    }

    // INSERT INTO DB
    saveStats(dbData, db)

    milestoneMsg(message, db, newsChannel)

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

    const memberRemoving = await reaction.message.guild.members.fetch(user.id)
    const canDelete = memberRemoving.permissions.has('MANAGE_MESSAGES') && reaction.me

    if (isUserRemoved || user.id === '217385992837922819' || canDelete) {
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
//     EVENT ON NEW GUILD JOIN
//
// --------------------------------------
bot.on('guildCreate', guild => {
  dbServers.addNewServer(guild.id, guild.name)
    .then(logMsg => {
      logChannel.send(`${logMsg}, <@217385992837922819>`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(`${errorMsg}, <@217385992837922819>`)
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
      logChannel.send(`${logMsg}, <@217385992837922819>`)
        .then().catch(console.error)
    }).catch(errorMsg => {
      errorChannel.send(`${errorMsg}, <@217385992837922819>`)
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