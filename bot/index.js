require('dotenv').config();
const { Client, MessageEmbed, Collection } = require('discord.js');
const bot = new Client();
const fs = require('fs')
const prefix = process.env.PREFIX
let calcServer = {}
let meee = {}
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
bot.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${bot.user.username}`);

  calcServer = bot.guilds.cache.get('581872879386492929')
  meee = calcServer.members.fetch('217385992837922819')
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
      .setTitle(`DM from ${message.author}`)
      .addField('Content:', `${message.content}`)
    message.channel.send(`I do not (yet?) support DM commands.\nYou can go into any server I'm in and do \`${prefix}help c\` for help with my most common command.\nFor more meta discussions, you can find the PolyCalculator server with \`${prefix}links\` in any of those servers!`)
      .then().catch(console.error)
    logChannel.send(logEmbed).then()
    return logChannel.send(`${meee}`).then()
  }

  // BOOLEAN for if the channel is registered as a bot channel in the bot
  let isNotBotChannel = true
  await dbServers.isRegisteredChannel(message.guild.id, message.channel.id)
    .then(x => isNotBotChannel = !x)

  const textStr = message.content.slice(prefix.length)
  const commandName = textStr.split(/ +/).shift().toLowerCase();
  const argsStr = textStr.slice(commandName.length + 1)

  // Map all the commands
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Return if the command doesn't exist
  if (!command)
    return

  // Instantiate the embed that's sent to every command execution
  const embed = new MessageEmbed().setColor('#ff0066')

  // Warning when channel name includes general and delete both messages
  if(message.channel.name.includes('general') && message.author.id != meee.id)
    return message.channel.send(`Come on! Not in #**${message.channel.name}**`)
      .then(x => {
        x.delete(5000).then().catch(console.error)
        message.delete(5000).then().catch(console.error)
      }).catch(console.error).catch(console.error)

  // Check if command is allowed in that channel
  if(command.channelsAllowed) { // Certain commands can only be triggered in specific channels
    if(!(command.channelsAllowed && command.channelsAllowed.some(x => x === message.channel.id)))
      return
  }

  // Check if the user has the permissions necessary to execute the command
  if(!(command.permsAllowed.some(x => message.member.hasPermission(x)) || command.usersAllowed.some(x => x === message.author.id)))
    return message.channel.send('Only an admin can use this command, sorry!')

  const willDelete = isNotBotChannel && !command.forceNoDelete
  try {
    // EXECUTE COMMAND
    const reply = await command.execute(message, argsStr, embed, willDelete);

    // Log the command
    if(message.cleanContent.length <= 256 && message.cleanContent.length >= 0) {
      logEmbed.setTitle(`**${message.cleanContent}**`)
        .setDescription(` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`)
      logChannel.send(logEmbed)
        .then(sent => {
          if(willDelete) {
            setInterval(function() {
              logEmbed.setDescription(` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n~~${message.url}~~`)
              sent.edit(logEmbed)}, 60000)
          }
        })
    }
    if(reply)
      message.channel.send(reply)
        .then(x => {
          if(willDelete) {
            x.delete(60000).then().catch(console.error)
            message.delete(60000).then().catch(console.error)
          }
        }).catch(console.error)
    return
  } catch (error) {
    errorChannel.send(`**${message.cleanContent}** by ${message.author} (@${message.author.tag})\n${error}\n${message.url}`)
    return message.channel.send(`${error}`)
      .then(x => {
        if(willDelete) {
          x.delete(15000).then().catch(console.error)
          message.delete(15000).then().catch(console.error)
        }
      }).catch(console.error)
  }
})

// --------------------------------------
//
//    EVENT ON CHANNEL DELETE
//
// --------------------------------------
bot.on('channelDelete', deletedChannel => {
  dbServers.getBotChannels(deletedChannel.guild.id)
    .then(x => { // x = array of bot channels
      if(x.some(y => y === deletedChannel.id))
        dbServers.removeABotChannel(deletedChannel.guild.id, deletedChannel.id)
          .then().catch(errorMsg => {
            errorChannel.send(errorMsg + `\n${deletedChannel.channel.name} in ${deletedChannel.guild.name}\n${meee}!`)
              .then()
              .catch()
          })
    }).catch(errorMsg => {
      errorChannel.send(errorMsg.concat('\n', `${meee}!`))
        .then().catch()
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
    dbServers.addABotChannel(createdChannel.guild.id, createdChannel.id)
      .then()
      .catch(errorMsg => {
        errorChannel.send(errorMsg + `\n${createdChannel.channel.name} in ${createdChannel.guild.name}\n${meee}!`)
          .then().catch()
      })
})
// --------------------------------------
//
//     EVENT ON NEW GUILD JOIN
//
// --------------------------------------
bot.on('guildCreate', guild => {
  const botChannelsMap = guild.channels.filter(x => (x.name.includes('bot') || x.name.includes('command')) && x.type === 'text')
  const botChannels = botChannelsMap.keys()

  dbServers.addNewServer(guild.id, guild.name, botChannels, meee)
    .then(logMsg => {
      logChannel.send(logMsg.concat(', ', `${meee}!`))
        .then().catch()
    })
    .catch(errorMsg => {
      errorChannel.send(errorMsg.concat('\n', `${meee}!`))
        .then().catch()
    })
})
// --------------------------------------
//
//      EVENT ON REMOVE GUILD JOIN
//
// --------------------------------------
bot.on('guildDelete', guild => {
  dbServers.removeServer(guild.id, guild.name)
    .then(logMsg => {
      logChannel.send(logMsg.concat(', ', `${meee}!`))
        .then().catch()
    })
    .catch(errorMsg => {
      errorChannel.send(errorMsg.concat('\n', `${meee}!`))
        .then().catch()
    })
})

// --------------------------------------
//
//  EVENT ON NEW MEMBER IN DEV SERVER
//
// --------------------------------------
bot.on('guildMemberAdd', newMember => {
  if(newMember.guild.id === '581872879386492929') {
    newMember.addRole('654164652741099540')
      .then(x => {
        // eslint-disable-next-line no-console
        console.log(`${x.user.tag} just got in PolyCalculator server!`)
      })
      .catch(console.error)
  }
})

// --------------------------------------
//        END/OTHER
// --------------------------------------
setInterval(function() {

}, 3600000); // every 1h (3600000) 3h (10800000) 6h (21600000)

bot.login(process.env.TOKEN);