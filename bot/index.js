require('dotenv').config()
const { Client, Collection } = require('discord.js')
const bot = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
})
const fs = require('fs')
const {
    buildEmbed,
    saveStats,
    logInteraction,
    milestoneMsg,
} = require('./util/util')
const db = require('../db')
let calcServer = {}
let newsChannel = {}
let feedbackChannel = {}
let logChannel = {}
let errorChannel = {}

bot.commands = new Collection()
const commandFiles = fs
    .readdirSync('./bot/commands')
    .filter((file) => file.endsWith('.js'))

bot.interactions = new Collection()
const interactionFiles = fs
    .readdirSync('./bot/interactions')
    .filter((file) => file.endsWith('.js') && !file.endsWith('index.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    bot.commands.set(command.name, command)
}

for (const file of interactionFiles) {
    const interaction = require(`./interactions/${file}`)
    bot.interactions.set(interaction.data.name, interaction)
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
    feedbackChannel = calcServer.channels.cache.get('738926248700411994')
    let toggle = true

    setInterval(function () {
        if (toggle) {
            bot.user.setActivity('/units', { type: 'PLAYING' })
            toggle = false
        } else {
            bot.user.setActivity('/help c', { type: 'PLAYING' })
            toggle = true
        }
    }, 10000)

    // eslint-disable-next-line no-console
    console.log(`Logged in as ${bot.user.username}`)
})

// --------------------------------------
//
//      EVENT ON SLASH
//
// --------------------------------------
bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    if (interaction.channel.type === 'dm') {
        const logMsg = []
        logMsg.push(`DM from ${interaction.user}(${interaction.user.username})`)
        logMsg.push('<@217385992837922819>')

        interaction
            .reply(
                "I do not support DM commands.\nYou can go into any server I'm in and do `/help c` for help with my most common command.\nFor more meta discussions, you can find the PolyCalculator server with `/links` in any of those servers!",
            )
            .catch(console.error)
        return logChannel.send(logMsg).catch(console.error)
    }

    const commandInteraction = bot.interactions.get(interaction.commandName)

    if (!commandInteraction) return

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
            footer: undefined,
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
            },
        },
    }

    try {
        replyData = await commandInteraction.execute(
            interaction,
            replyData,
            dbData,
        )

        const embed = buildEmbed(replyData)

        const options = {
            embeds: [embed],
            fetchReply: true,
        }

        if (replyData.content.length !== 0)
            options.content = replyData.content.map((x) => x[0]).join('\n')

        const interactionResponse = await interaction.reply(options)

        dbData.url = interactionResponse.url
        interactionResponse.react('🗑️').then().catch(console.error)
        // interactionResponse.edit({ embeds: [embed] })

        logInteraction(interaction, logChannel, interactionResponse)

        saveStats(dbData, db)

        milestoneMsg(interaction, db, newsChannel)
    } catch (error) {
        console.error(error)
        await interaction.reply(
            `${error.message ? `${error.message}: ${error.name}` : error}`,
        ) //{ content: 'There was an error while executing this command!'/*, ephemeral: true */ });
    }
})

bot.on('messageReactionAdd', async (reaction, user) => {
    try {
        if (reaction.message.partial) await reaction.message.fetch()

        if (reaction.partial) await reaction.fetch()

        if (user.bot) return

        if (reaction.message.author.id !== bot.user.id) return

        if (reaction.emoji.name !== '🗑️') return

        const sql =
            'SELECT author_id, message_id, is_slash FROM stats WHERE url = $1'
        const values = [reaction.message.url]
        const returned = await db.query(sql, values)
        let isUserRemoved = false

        if (!returned.rows[0]) return

        const {
            author_id: userId,
            message_id: initialMessageId,
            is_slash: isSlash,
        } = returned.rows[0]

        if (!isSlash) {
            const triggerMessage =
                await reaction.message.channel.messages.fetch(initialMessageId)
            if (triggerMessage) triggerMessage.delete()
        }
        isUserRemoved = true && userId === user.id

        const memberRemoving = await reaction.message.guild.members.fetch(
            user.id,
        )
        const canDelete = memberRemoving.permissions.has('MANAGE_MESSAGES')

        if (isUserRemoved || user.id === '217385992837922819' || canDelete)
            await reaction.message.delete()
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        // const pathArray = error.path.split('/')
        errorChannel.send(
            `messageReactionAdd\n${error.message}\n${error.stack}`,
        )
    }
})
// --------------------------------------
//
//     EVENT ON NEW GUILD JOIN
//
// --------------------------------------
bot.on('guildCreate', (guild) => {
    dbServers
        .addNewServer(guild.id, guild.name)
        .then((logMsg) => {
            feedbackChannel
                .send(`${logMsg}, <@217385992837922819>`)
                .then()
                .catch(console.error)
        })
        .catch((errorMsg) => {
            errorChannel
                .send(`guildCreate\n${errorMsg}, <@217385992837922819>`)
                .then()
                .catch(console.error)
        })
    return
})

// --------------------------------------
//
//      EVENT ON REMOVE GUILD JOIN
//
// --------------------------------------
bot.on('guildDelete', (guild) => {
    dbServers
        .removeServer(guild.id, guild.name)
        .then((logMsg) => {
            feedbackChannel
                .send(`${logMsg}, <@217385992837922819>`)
                .then()
                .catch(console.error)
        })
        .catch((errorMsg) => {
            errorChannel
                .send(`guildDelete\n${errorMsg}, <@217385992837922819>`)
                .then()
                .catch(console.error)
        })
    return
})

// --------------------------------------
//
//  EVENT ON NEW MEMBER IN DEV SERVER
//
// --------------------------------------
bot.on('guildMemberAdd', (newMember) => {
    if (newMember.guild.id === '581872879386492929') {
        newMember.roles
            .add('654164652741099540')
            .then((x) => {
                // eslint-disable-next-line no-console
                console.log(`${x.user.tag} just got in PolyCalculator server!`)
            })
            .catch(console.error)
    }
})

process.on('unhandledRejection', (code) => {
    // eslint-disable-next-line no-console
    console.log(`unhandledRejection: ${code.stack}`)
    errorChannel.send(`unhandledRejection\n${code.stack}`)
})

bot.login(process.env.TOKEN)
