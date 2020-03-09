// https://rpm.newrelic.com/accounts/2645843/applications/setup#nodejs
// https://rpm.newrelic.com/accounts/2645843/browser/new#/?_k=ny1qvo
// npm install newrelic
// require('newrelic');
require('dotenv').config();
const { Client, RichEmbed, Collection } = require('discord.js');
const bot = new Client();
const open = require('open');
const { getFightUnit, getUnit, getUnits, getBonus, getRetaliation, getCurrentHP, getMaxHP } = require("./units");
const Fight = require("./fight");
const Help = require("./help")
const db = require("./db")
const stats = require("./stats")
let prefix = process.env.PREFIX
let calcServer
let meee
let logChannel
let errorChannel

//--------------------------------------
//
//           EVENT ON LOGIN
//
//--------------------------------------
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}`);

    calcServer = bot.guilds.get("581872879386492929")
    meee = calcServer.members.get('217385992837922819')
    logChannel = calcServer.channels.get("648688924155314176")
    errorChannel = calcServer.channels.get("658125562455261185")

    bot.user.setActivity(`${prefix}help c`, { type: 'LISTENING' })

    if(bot.user.id != process.env.BETABOT_ID)
        logChannel.send(`Logged in as ${bot.user.username}, ${meee}`)
});

bot.on('voiceStateUpdate', async (oldState, newState) => {
    console.log('newState.voiceChannelID', newState.voiceChannelID)
    if(newState.voiceChannelID != '659926148788125726')
        return

    await open('https://polycalculatorbot.com');
})

//--------------------------------------
//
//          EVENT ON MESSAGE
//
//--------------------------------------
bot.on('message', async message => {
    if(message.author.bot || !message.content.startsWith(prefix) || message.content === prefix) {
//        console.log(message.author.bot, !message.content.startsWith(prefix), message.content === prefix, message.content.startsWith(`${prefix}.`))
        return
    }
    let botChannel = []

    if(message.channel.type != 'dm') {
        await db.getBotChannels(message.guild.id)
            .then(x => { botChannel = x })
    } else {
        if(message.author.bot)
            return
        let logEmbed = new RichEmbed().setColor('#FA8072')
            .setTitle(`DM from ${message.author}`)
            .addField(`Content:`,`${message.content}`)
        return await logChannel.send(logEmbed)
            .then(x => { logChannel.send(`${meee}`) } )
    }
    
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();

    let logEmbed = new RichEmbed().setColor('#FA8072')
    if(message.cleanContent.length <= 256 && !cmd.startsWith('.')) {
        logEmbed.setTitle(`**${message.cleanContent}**`)
            .setDescription(` in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`)
        //logChannel.send(`**\`${message.cleanContent}\`** in **${message.guild.name.toUpperCase()}**\nin ${message.channel} (#${message.channel.name})\nby ${message.author} (${message.author.tag})\n${message.url}`)
        logChannel.send(logEmbed)
    }

    console.log(`${message.cleanContent} in ${message.guild.name.toUpperCase()} in #${message.channel.name} by ${message.author.tag}`);
    let args;
 
    //INSIDER
    if(message.channel.name === "insider-information") {
        let guilds = message.client.guilds;
        if(cmd === "stats") {
            embed = new RichEmbed()
            owners = [];
            i=0;
            message.channel.send(`Total de serveurs: ${message.client.guilds.size}`)
            guilds.forEach((x) => {
                embed.addField(`**${x.name}** (${x.id}):`, `${x.owner.user} ${x.owner.user.tag}\n-Number of members: ${x.memberCount}\n-Number of channels: ${x.channels.size}\n`)
                i=i+1;
            })
            message.channel.send(embed)
        }
        if(cmd === "pingowners") {
            guilds.forEach((x) => {
                args = message.content.slice(prefix.length+cmd.length+1);
                owner = x.owner.user

                owner.send(args)
                    .then(x => {
                        logChannel.send(`${x.channel.recipient} got the message!`)
                    })
                    .catch(x => {
                        errorChannel.send(`${x.channel.recipient} didn't get the message!`)
                    })
            })
            
        }
    }
//--------------------------------------------------
//
//                 .HELP COMMAND
//
//--------------------------------------------------
    if (cmd === "help") {

        if (message.channel.name.startsWith("general") && message.author.id != '217385992837922819')
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel} after 5 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 5 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
        if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
            stats.addStats(message.cleanContent, message.author, cmd, message.url, '', message.guild.id)
                .then()
                .catch(errorMsg => {
                    errorMsg = errorMsg.toString()
                    errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                        .then(() => {})
                        .catch(() => {})
                })
        return Help(args[0], message, false)

//--------------------------------------------------
//
//                .REMOVEBOTCHANNEL COMMAND
//
//--------------------------------------------------
    } else if(cmd === "removebotchannel" || cmd === "rbc") {
    if (!message.member.hasPermission(`ADMINISTRATOR`) && message.author != meee.user)
        return message.channel.send(`Only an admin can modify the registerd bot channels, sorry!`)
    
    let channelToRemove = message.mentions.channels.first()
    
    if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent, message.author, cmd, message.url, '', message.guild.id)
            .then()
            .catch(errorMsg => {
                errorMsg = errorMsg.toString()
                errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                    .then(() => {})
                    .catch(() => {})
            })

    if(channelToRemove) {
        await db.removeABotChannel(message.guild.id, channelToRemove.id)
            .then(x => {
                if(x.length != 0) {
                    msg = ['This is the updated list of registered bot channels:']
                    x.forEach(x => {
                        msg.push(message.guild.channels.get(x))
                    })
                } else
                    msg = [`You don't have any registered bot channels anymore.\nUse \`${prefix}addbotchannel\` with a channel pinged to register a bot channel with me!`]
                message.channel.send(msg)
            })
            .catch(x => {
                message.channel.send(x)
                    .then(x => errorChannel.send([x.cleanContent,x.url]))
            })
    }
    else {
        await db.getBotChannels(message.guild.id)
            .then(x => {
                let msg = []

                if (x.length != 0) {
                    msg.push('You need to ping a channel for it to be removed.')
                    msg.push('Here are the registered bot channels that won\'t auto-delete the commands:')
                    x.forEach(x => {
                        msg.push(message.guild.channels.get(x))
                    })
                } else {
                    msg.push('You don\'t yet have bot channels registered with me.')
                    msg.push(`You can register them one by one using \`${prefix}addbotchannel\` with a channel ping!`)
                }
                message.channel.send(msg)
            })
            .catch(x => {message.channel.send(x)})
    }
//--------------------------------------------------
//
//             .ADDBOTCHANNEL COMMAND
//
//--------------------------------------------------
} else if(cmd === "addbotchannel" || cmd === "abc") {
    if (!message.member.hasPermission(`ADMINISTRATOR`) && message.author != meee.user)
        return message.channel.send(`Only an admin can modify the registerd bot channels, sorry!`)

    let channelToAdd = message.mentions.channels.first()

    if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent, message.author, cmd, message.url, '', message.guild.id)
            .then()
            .catch(errorMsg => {
                errorMsg = errorMsg.toString()
                errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                    .then(() => {})
                    .catch(() => {})
            })

    if(channelToAdd) {
        await db.addABotChannel(message.guild.id, channelToAdd.id)
            .then(x => {

                msg = ['The channel was added!\n', 'This is the updated list of registered bot channels:']
                x.forEach(x => {
                    msg.push(message.guild.channels.get(x))
                })
                message.channel.send(msg)
            })
            .catch(x => {
                message.channel.send(x)
                    .then(()=>{})
            })
    }
    else {
        await db.getBotChannels(message.guild.id)
            .then(x => {
                let msg = []
                if (x.length != 0) {
                    msg.push('You need to ping a channel for it to be added.')
                    msg.push('Here are the registered bot channels that won\'t auto-delete the commands:')
                    x.forEach(x => {
                        msg.push(message.guild.channels.get(x))
                    })
                } else {
                    msg.push('You don\'t yet have bot channels registered with me.')
                    msg.push(`You can register them one by one using \`${prefix}addbotchannel\` with a channel ping!`)
                }
                message.channel.send(msg)
                    .then(()=>{})
            })
            .catch(x => {message.channel.send(x).then(()=>{})})
    }
//--------------------------------------------------
//
//                 .UNITS COMMAND
//
//--------------------------------------------------
} else if (cmd.startsWith("unit")) {
    if (message.channel.name.startsWith("general"))
        return message.channel.send(`Come on! Not in **${message.channel.name}**`)
            .then(x => {
                if(!botChannel.some(x => x === message.channel.id)) {
                    x.delete(5000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(5000)
                        .then(x => {
                            logChannel.send(`Message deleted in ${message.channel} after 5 seconds`)
                            console.log(`Message deleted in ${message.channel} after 5 seconds`)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)    

    unitEmbed = new RichEmbed();
    unitEmbed.setColor('#FA8072')
        .setTitle("All units by code")
    units = [];

    allUnits = getUnits();
    Object.keys(allUnits).forEach(function (key) {
        units.push(`${allUnits[key].name}: ${key}`)
    });
    
    unitEmbed.setDescription(units)
    
    if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
        stats.addStats(message.cleanContent, message.author, cmd, message.url, '', message.guild.id)
            .then()
            .catch(errorMsg => {
                errorMsg = errorMsg.toString()
                errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                    .then(() => {})
                    .catch(() => {})
            })
    message.channel.send(unitEmbed)
        .then(x => {
            if(!botChannel.some(x => x === message.channel.id)) {
                x.delete(60000)
                    .then(x => {})
                    .catch(console.error)
                message.delete(60000)
                    .then(x => {
                        logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                        console.log(`Message deleted in ${message.channel.name} after 1 min`)
                    })
                    .catch(console.error)
            }
        })
        .catch(console.error)
//--------------------------------------------------
//
//                .FULL COMMAND
//
//--------------------------------------------------
    } else if (cmd === "full" || cmd === "f") {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 5 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 5 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();

        if(args.length === 0)
            return Help(cmd, message, false)

        if(isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3]) || isNaN(args[4]) || isNaN(args[5]) || args[0] === undefined || Number(args[0]) > 40 || Number(args[0]) < 1 || Number(args[1]) > 40 || Number(args[1]) < 1 || Number(args[0]) > Number(args[1]) || Number(args[2]) < 1 || Number(args[2]) > 5 || Number(args[3]) > 40 || Number(args[3]) < 1 || Number(args[4]) > 40 || Number(args[4]) < 1 || Number(args[3]) > Number(args[4]) || Number(args[5]) < 0 || Number(args[5]) > 5)
            return message.channel.send(`ERROR: There is a problem with your format, try \`${prefix}help full\``)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 10 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 10 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        
        let defender = {name: "Defender"}

        defBonusVals = getBonus(args)
        defender.name = defender.name+`${defBonusVals[1]}`
        retal = getRetaliation(args)

        let result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),`${defender.name}`,Number(args[3]),Number(args[4]),Number(args[5]), defBonusVals[0], retal)
        let resEmbed = result.calculate()

        if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
            stats.addStats(message.cleanContent, message.author, cmd, message.url, resEmbed, message.guild.id)
                .then()
                .catch(errorMsg => {
                    errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                        .then(() => {})
                        .catch(() => {})
                })
        message.channel.send(resEmbed)
            .then(x => {
                if(!botChannel.some(x => x === message.channel.id)) {
                    x.delete(60000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(60000)
                        .then(x => {
                            logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                            console.log(`Message deleted in ${message.channel.name} after 1 min`)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
//--------------------------------------------------
//
//                .TEST COMMAND
//
//--------------------------------------------------
    } else if (cmd === "test" || cmd === "t") {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 5 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 5 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args.length === 0)
            return Help(cmd, message, false)

        let defender = {name: "Defender"}
        defBonusVals = getBonus(args)
        defender.name = defender.name+`${defBonusVals[1]}`
        retal = getRetaliation(args)

        let result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),`${defender.name}`,Number(args[3]),Number(args[4]),Number(args[5]), defBonusVals[0], retal)
        let resEmbed = result.calculate()

        if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
            stats.addStats(message.cleanContent, message.author, cmd, message.url, resEmbed, message.guild.id)
                .then()
                .catch(errorMsg => {
                    errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                        .then(() => {})
                        .catch(() => {})
                })
        message.channel.send(resEmbed)
            .then(x => {
                if(!botChannel.some(x => x === message.channel.id)) {
                    x.delete(60000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(60000)
                        .then(x => {
                            logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                            console.log(`Message deleted in ${message.channel.name} after 1 min`)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
//--------------------------------------------------
//
//                .CALC COMMAND
//
//--------------------------------------------------
    } else if (cmd.startsWith("cal") || cmd === 'c' || cmd.startsWith("eli") || cmd === 'e' || cmd.startsWith("bulk") || cmd === 'b') {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    x.delete(5000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(5000)
                        .then(x => {
                            logChannel.send(`Message deleted in ${message.channel.name} after 5 seconds`)
                            console.log(`Message deleted in ${message.channel.name} after 5 seconds`)
                        })
                        .catch(console.error)
                })
                .catch(console.error)    
//--------------------------------------------------
//          HANDLER TO CLEAN THE CMD ARRAY
//--------------------------------------------------
        args = message.content.toLowerCase().slice(prefix.length+cmd.length);

        if(args.length === 0)
            return Help(cmd, message, false)

        if(args.includes("/"))
            unitsArray = args.split("/")
        else if(args.includes(","))
            unitsArray = args.split(",")
        else
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`")
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 10 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 10 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)

        attackerArray = unitsArray[0].split(/ +/).filter(x => x != "")
        defenderArray = unitsArray[1].split(/ +/).filter(x => x != "")

        if(attackerArray.length === 0 || defenderArray.length === 0)
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`")
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 10 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 10 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        try {
            attackerStats = getFightUnit(attackerArray, prefix)
            defenderStats = getFightUnit(defenderArray, prefix)
        } catch (error) {
            return message.channel.send(`**ERROR:** ${error}`)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 10 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 10 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        }

        finalAttacker = {
            name: attackerStats.name,
            currentHP: getCurrentHP(attackerArray, getMaxHP(attackerArray, attackerStats), message),
            maxHP: getMaxHP(attackerArray, attackerStats),
            att: attackerStats.att
        }

        if(defenderArray.some(x => x === 'w') && defenderArray.some(x => x === 'd'))
            message.channel.send("You've put both `d` and `w`. By default, it'll take `w` over `d` if both are present.")
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                console.log(`Message deleted in ${message.channel.name} after 1 min`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)

        defBonusVals = getBonus(defenderArray, defenderStats)
        finalDefender = {
            currentHP: getCurrentHP(defenderArray, getMaxHP(defenderArray, defenderStats), message),
            maxHP: getMaxHP(defenderArray, defenderStats),
            def: defenderStats.def,
            retaliation: getRetaliation(defenderArray),
        }

        if(defenderStats.fort === false && defBonusVals[0] === 4) {
            finalDefender.name = `${defenderStats.name}`
            finalDefender.bonus = 1
            message.channel.send("This defender doesn't have fortify, so it doesn't benefit from a wall.\nFor a single bonus, use `d` instead of `w` used for wall.")
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                console.log(`Message deleted in ${message.channel.name} after 1 min`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        } else {
            finalDefender.name = `${defenderStats.name}${defBonusVals[1]}`
            finalDefender.bonus = defBonusVals[0];
        }

        if(attackerStats.att === 0)
            return message.channel.send(`You know very well that ${attackerStats.name}s can't attack...`)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 10 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 10 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
                
        let result = new Fight(finalAttacker.name, finalAttacker.currentHP, finalAttacker.maxHP, finalAttacker.att,finalDefender.name, finalDefender.currentHP, finalDefender.maxHP, finalDefender.def, finalDefender.bonus, finalDefender.retaliation, finalDefender.fort)
        let resEmbed = result.calculate()

        if(cmd.startsWith("elim") || cmd === "e") {
            if(attackerArray.some(x => x.includes('?')) && defenderArray.some(x => x.includes('?'))) {
                message.channel.send(`*Note that any hp input will be disregarded.*`)
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
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
                                .then(() => {})
                                .catch(() => {})
                        })

                message.channel.send(result.provideDefHP())
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
                                    logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                    console.log(`Message deleted in ${message.channel.name} after 1 min`)
                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)

                message.channel.send(result.provideAttHP())
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
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
                                .then(() => {})
                                .catch(() => {})
                        })
                message.channel.send(result.provideDefHP())
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
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
                                .then(() => {})
                                .catch(() => {})
                        })
                message.channel.send(result.provideAttHP())
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
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
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
                                    logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                    console.log(`Message deleted in ${message.channel.name} after 1 min`)
                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
        } else if(cmd.startsWith("bulk") || cmd === "b") {
            if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
                stats.addStats(message.cleanContent.slice(prefix.length).toLowerCase(), message.author, cmd, message.url, resEmbed, message.guild.id)
                    .then()
                    .catch(errorMsg => {
                        errorMsg = errorMsg.toString()
                        errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                            .then(() => {})
                            .catch(() => {})
                    })
            message.channel.send(result.bulk())
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => {
                                    logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                    console.log(`Message deleted in ${message.channel.name} after 1 min`)
                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
        } else {
            if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
                stats.addStats(message.cleanContent.slice(prefix.length).toLowerCase(), message.author, cmd, message.url, resEmbed, message.guild.id)
                    .then()
                    .catch(errorMsg => {
                        errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                            .then(() => {})
                            .catch(() => {})
                    })
            message.channel.send(resEmbed)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
                                console.log(`Message deleted in ${message.channel.name} after 1 min`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        }
//--------------------------------------------------
//
//                 .CREDITS COMMAND
//
//--------------------------------------------------
    } else if (cmd === "credits") {
        if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
            stats.addStats(message.cleanContent, message.author, cmd, message.url, '', message.guild.id)
                .then()
                .catch(errorMsg => {
                    errorMsg = errorMsg.toString()
                    errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                        .then(() => {})
                        .catch(() => {})
                })
        helpEmbed = new RichEmbed()
        helpEmbed.setColor('#FA8072')
            .setTitle('PolyCalculator\'s server')
            .setDescription('For bot updates, feature requests and bug reports')
            .addField("Developer", "jd (alphaSeahorse)")
            .addField("Contributions","penile partay, WOPWOP, Cake, James, LiNoKami.")
            .setURL("https://discord.gg/rtSTmd8")
        message.channel.send(helpEmbed)
            .then(x => {})
            .catch(console.error)
    } else if (cmd === "auto") {
        polytopia = bot.guilds.get('283436219780825088')
        botcommands = polytopia.channels.get('403724174532673536')
        message = {'channel':botcommands}
        Help('help', message, false)
//--------------------------------------------------
//
//                .{UNIT} COMMAND
//
//--------------------------------------------------
    } else {
        cmd = cmd.substring(0, 2)
        unit = getUnit(cmd)

        if(unit) {

            if (message.channel.name.startsWith("general")) {
                return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                    .then(x => {
                        if(!botChannel.some(x => x === message.channel.id)) {
                            x.delete(5000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(5000)
                                .then(x => {
                                    logChannel.send(`Message deleted in ${message.channel.name} after 5 seconds`)
                                    console.log(`Message deleted in ${message.channel.name} after 5 seconds`)
                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)            
            }

            if (message.channel.id != '660136237725777955' || bot.user.id != '600161946867597322')
                stats.addStats(unit.name.toLowerCase(), message.author, cmd, message.url, '', message.guild.id)
                    .then()
                    .catch(errorMsg => {
                        errorMsg = errorMsg.toString()
                        errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                            .then(() => {})
                            .catch(() => {})
                    })

            helpEmbed = new RichEmbed()
                .setColor('#FA8072')
                .setTitle(unit.name)
            let descriptionArray = [];
            descriptionArray.push(`maxhp: ${unit.maxhp}`)
            descriptionArray.push(`vethp: ${unit.vethp}`)
            descriptionArray.push(`attack: ${unit.att}`)
            descriptionArray.push(`defense: ${unit.def}`)

            helpEmbed.setDescription(descriptionArray);
            message.channel.send(helpEmbed)
                .then(x => {
                    if(!botChannel.some(x => x === message.channel.id)) {
                        x.delete(20000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(20000)
                            .then(x => {
                                logChannel.send(`Message deleted in ${message.channel.name} after 20 seconds`)
                                console.log(`Message deleted in ${message.channel.name} after 20 seconds`)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        }
    }
})

//--------------------------------------
//
//        EVENT ON CHANNEL DELETE
//
//--------------------------------------
bot.on('channelDelete', deletedChannel => {
    db.getBotChannels(deletedChannel.guild.id)
        .then(x => { // x = array of bot channels
            if(x.some(x => x === deletedChannel.id))
                db.removeABotChannel(deletedChannel.guild.id, deletedChannel.id)
                    .then(() => {})
                    .catch(console.error)
        })
        .catch(console.error)
})
//--------------------------------------
//
//        EVENT ON CHANNEL CREATE
//
//--------------------------------------
bot.on('channelCreate', createdChannel => {
    if(createdChannel.type != 'text')
        return

    if(createdChannel.name.includes('bot') || createdChannel.name.includes('command'))
        db.addABotChannel(createdChannel.guild.id, createdChannel.id)
            .then(() => {})
            .catch(console.error)
})
//--------------------------------------
//
//        EVENT ON CHANNEL UPDATE
//
//--------------------------------------
bot.on('channelUpdate', (oldChannel, updatedChannel) => {
    if(updatedChannel.type != 'text')
        return

    db.getBotChannels(updatedChannel.guild.id)
        .then(x => { // x = array of bot channels
            if(updatedChannel.name.includes('bot') || updatedChannel.name.includes('command')) {
                console.log('channelUpdate')
                db.addABotChannel(updatedChannel.guild.id, updatedChannel.id)
                    .then(() => {})
                    .catch(console.error)
            } else if (x.some(x => x === updatedChannel.id))
                db.removeABotChannel(updatedChannel.guild.id, updatedChannel.id)
                    .then(() => {})
                    .catch(console.error)
            else
                return
        })
        .catch(console.error)
})
//--------------------------------------
//
//       EVENT ON NEW GUILD JOIN
//
//--------------------------------------
bot.on('guildCreate', guild => {
    botChannels = guild.channels.filter(x => (x.name.includes('bot') || x.name.includes('command')) && x.type === 'text')

    db.addNewServer(guild.id, guild.name, botChannels)
        .then(logMsg => {
            logChannel.send(logMsg.concat(', ', `${meee}!`))
                .then(() => {})
                .catch(() => {})
        })
        .catch(errorMsg => {
            errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                .then(() => {})
                .catch(() => {})
        })
})
//--------------------------------------
//
//     EVENT ON REMOVE GUILD JOIN
//
//--------------------------------------
bot.on('guildDelete', guild => {
    db.removeServer(guild.id, guild.name)
        .then(logMsg => {
            logChannel.send(logMsg.concat(', ', `${meee}!`))
                .then(() => {})
                .catch(() => {})
        })
        .catch(errorMsg => {
            errorChannel.send(errorMsg.concat(', ', `${meee}!`))
                .then(() => {})
                .catch(() => {})
        })
})

//--------------------------------------
//
//  EVENT ON NEW MEMBER IN DEV SERVER
//
//--------------------------------------
bot.on('guildMemberAdd', newMember => {
    if (newMember.guild.id === '581872879386492929') {
        newMember.addRole('654164652741099540')
            .then(x => {
                console.log(`${x.user.tag} just got in PolyCalculator server!`)
            })
            .catch(console.error)
    }
})

//--------------------------------------
//              END/OTHER
//--------------------------------------
// const port = process.env.PORT || 5000;

// setInterval(function() {
//     http.get("http://polycalculator.herokuapp.com");
// }, 300000); // every 5 minutes (300000)

setInterval(function() {
    polytopia = bot.guilds.get('283436219780825088')

    botcommands = polytopia.channels.get('403724174532673536')
    botcommands = {'channel':botcommands}
    Help('c', botcommands, true)
    rankedelogames = polytopia.channels.get('511316081160355852')
    rankedelogames = {'channel':rankedelogames}
    Help('c', rankedelogames, true)
    unrankedgames = polytopia.channels.get('511906353476927498')
    unrankedgames = {'channel':unrankedgames}
    Help('c', unrankedgames, true)
    elobotcommands = polytopia.channels.get('635091071717867521')
    elobotcommands = {'channel':elobotcommands}
    Help('c', elobotcommands, true)
}, 21600000); // every 3h (10800000) 6h (21600000)

bot.login(process.env.TOKEN);