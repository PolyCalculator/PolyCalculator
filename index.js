require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http");
const { getFightUnit, getUnit, getUnits, getBonus, getRetaliation, getCurrentHP, getMaxHP } = require("./src/units");
const Fight = require("./src/fight");
const Help = require("./src/help")

const express = require('express');
var app = express();

bot.on('ready', () => {
    const prefix = process.env.PREFIX;
    console.log(`Logged in as ${bot.user.username}`);

    bot.user.setActivity(`prefix: ${prefix}`, { type: 'LISTENING' });
});

//--------------------------------------
//
//          EVENT ON MESSAGE
//
//--------------------------------------
bot.on('message', message => {
    prefix = process.env.PREFIX;

    if(message.author.bot || !message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(`${prefix}.`))
        return;

    const botChannel = message.channel.name.includes("bot") || message.channel.name.includes("command") || message.channel.name.includes("elo")
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();
    console.log(`${message.cleanContent} in ${message.guild.name.toUpperCase()} in #${message.channel.name} by ${message.author.tag}`);
    let args;

    //INSIDER
    if(message.channel.name === "insider-information") {
        let guilds = message.client.guilds;
        if(cmd === "stats") {
            owners = [];
            i=0;
            guilds.forEach((x) => {
                owners[i] = `**${x.name}**: ${x.owner.user} ${x.owner.user.tag}\n-Number of members: ${x.memberCount}\n-Number of channels: ${x.channels.size}\n`
                i=i+1;
            })
            message.channel.send(`Total de serveurs: ${message.client.guilds.size}`)
            message.channel.send(owners)
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
                    if(!botChannel) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 5 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
        return Help(args[0], message)
        
//--------------------------------------------------
//
//                 .UNITS COMMAND
//
//--------------------------------------------------
    } else if (cmd.startsWith("unit")) {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    if(!botChannel) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 5 seconds`))
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
        
        unitEmbed.setDescription(units);
        message.channel.send(unitEmbed)
            .then(x => {
                if(!botChannel) {
                    x.delete(60000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(60000)
                        .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
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
                    if(!botChannel) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 5 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();

        if(args.length === 0)
            return Help(cmd, message)

        if(isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3]) || isNaN(args[4]) || isNaN(args[5]) || args[0] === undefined || Number(args[0]) > 40 || Number(args[0]) < 1 || Number(args[1]) > 40 || Number(args[1]) < 1 || Number(args[0]) > Number(args[1]) || Number(args[2]) < 1 || Number(args[2]) > 5 || Number(args[3]) > 40 || Number(args[3]) < 1 || Number(args[4]) > 40 || Number(args[4]) < 1 || Number(args[3]) > Number(args[4]) || Number(args[5]) < 0 || Number(args[5]) > 5)
            return message.channel.send(`ERROR: There is a problem with your format, try \`${prefix}help full\``)
                .then(x => {
                    if(!botChannel) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 10 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        
        let defender = {name: "Defender"}

        defBonusVals = getBonus(args)
        defender.name = defender.name+`${defBonusVals[1]}`
        retal = getRetaliation(args)

        const result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),`${defender.name}`,Number(args[3]),Number(args[4]),Number(args[5]), defBonusVals[0], retal)

        message.channel.send(result.calculate())
            .then(x => {
                if(!botChannel) {
                    x.delete(60000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(60000)
                        .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
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
                    if(!botChannel) {
                        x.delete(5000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(5000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 5 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)    

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args.length === 0)
            return Help(cmd, message)

        let defender = {name: "Defender"}
        defBonusVals = getBonus(args)
        defender.name = defender.name+`${defBonusVals[1]}`
        retal = getRetaliation(args)

        const result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),`${defender.name}`,Number(args[3]),Number(args[4]),Number(args[5]), defBonusVals[0], retal)
        message.channel.send(result.calculate())
            .then(x => {
                if(!botChannel) {
                    x.delete(60000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(60000)
                        .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                        .catch(console.error)
                }
            })
            .catch(console.error)
//--------------------------------------------------
//
//                .CALC COMMAND
//
//--------------------------------------------------
    } else if (cmd === "calc" || cmd === 'c' || cmd.startsWith("elim") || cmd === 'e') {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    x.delete(5000)
                        .then(x => {})
                        .catch(console.error)
                    message.delete(5000)
                        .then(x => console.log(`Message deleted in ${message.channel.name} after 5 seconds`))
                        .catch(console.error)
                })
                .catch(console.error)    
//--------------------------------------------------
//          HANDLER TO CLEAN THE CMD ARRAY
//--------------------------------------------------
        args = message.content.toLowerCase().slice(prefix.length+cmd.length);

        if(args.length === 0)
            return Help(cmd, message)

        if(args.includes("/"))
            unitsArray = args.split("/")
        else if(args.includes(","))
            unitsArray = args.split(",")
        else
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`")
                .then(x => {
                    if(!botChannel) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 10 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)

        attackerArray = unitsArray[0].split(/ +/).filter(x => x != "")
        defenderArray = unitsArray[1].split(/ +/).filter(x => x != "")

        if(attackerArray.length === 0 || defenderArray.length === 0)
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`")
                .then(x => {
                    if(!botChannel) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 10 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)
//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        try {
            attackerStats = getFightUnit(attackerArray)
            defenderStats = getFightUnit(defenderArray)
        } catch (error) {
            console.log("ERROR:", error)
            return message.channel.send(`**ERROR:** ${error}`)
                .then(x => {
                    if(!botChannel) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 10 seconds`))
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
                    if(!botChannel) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
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
                    if(!botChannel) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        } else {
            finalDefender.name = `${defenderStats.name}${defBonusVals[1]}`
            finalDefender.bonus = defBonusVals[0];
        }

        if(attackerStats.name.toLowerCase() === "mooni" || attackerStats.name.toLowerCase() === "mind bender")
            return message.channel.send(`You know very well that ${attackerStats.name.toLowerCase()}s can't attack...`)
                .then(x => {
                    if(!botChannel) {
                        x.delete(10000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(10000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 10 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)

        let result = new Fight(finalAttacker.name, finalAttacker.currentHP, finalAttacker.maxHP, finalAttacker.att,finalDefender.name, finalDefender.currentHP, finalDefender.maxHP, finalDefender.def, finalDefender.bonus, finalDefender.retaliation)

        if((cmd.startsWith("elim") || cmd === "e")) {
            if(attackerArray.some(x => x.includes('?')) && defenderArray.some(x => x.includes('?'))) {
                message.channel.send(`*Note that any hp input will be disregarded.*`)
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
                message.channel.send(result.provideDefHP())
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
                result = new Fight(finalAttacker.name, finalAttacker.currentHP, finalAttacker.maxHP, finalAttacker.att,finalDefender.name, finalDefender.currentHP, finalDefender.maxHP, finalDefender.def, finalDefender.bonus, finalDefender.retaliation, finalDefender.fort)
                message.channel.send(result.provideAttHP())
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            } else if(attackerArray.some(x => x.includes('?')))
                message.channel.send(result.provideDefHP())
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            else if(defenderArray.some(x => x.includes('?')))
                message.channel.send(result.provideAttHP())
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            else
                message.channel.send(`You are either missing a \`?\` to display the most optimal hp to eliminate units.\n\`${prefix}help e\` for more information.\n\nOr you are looking for the basic \`${prefix}c\` command.\n\`${prefix}help c\` for more information.`)
                    .then(x => {
                        if(!botChannel) {
                            x.delete(60000)
                                .then(x => {})
                                .catch(console.error)
                            message.delete(60000)
                                .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
        } else {
            message.channel.send(result.calculate())
                .then(x => {
                    if(!botChannel) {
                        x.delete(60000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(60000)
                            .then(x => console.log(`Messages deleted in ${message.channel.name} after 1 min`))
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
        helpEmbed = new RichEmbed()
        helpEmbed.setColor('#FA8072')
            .setTitle('**Contributors**')
        helpEmbed.addField("Developer", "jd (alphaSeahorse)")
        helpEmbed.addField("Contributions","penile partay, WOPWOP, Cake, James, LiNoKami.")
        message.channel.send(helpEmbed)
            .then(x => {})
            .catch(console.error)
//--------------------------------------------------
//
//                .{UNIT} COMMAND
//
//--------------------------------------------------
    } else if (cmd === "auto") {
        polytopia = bot.guilds.get('283436219780825088')
        botcommands = polytopia.channels.get('403724174532673536')
        message = {'channel':botcommands}
        Help('help', message)
    } else {
        if (message.channel.name.startsWith("general")) {
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
                .then(x => {
                    if(!botChannel) {
                        x.delete(20000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(20000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 20 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)            
        }

        cmd = cmd.substring(0, 2)
        unit = getUnit(cmd)

        if(unit) {
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
                    if(!botChannel) {
                        x.delete(20000)
                            .then(x => {})
                            .catch(console.error)
                        message.delete(20000)
                            .then(x => console.log(`Message deleted in ${message.channel.name} after 20 seconds`))
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        }
    }
})
//--------------------------------------
//              END/OTHER
//--------------------------------------
const port = process.env.PORT || 5000;

setInterval(function() {
    http.get("http://polycalculator.herokuapp.com");
}, 300000); // every 5 minutes (300000)

setInterval(function() {
    polytopia = bot.guilds.get('283436219780825088')

    botcommands = polytopia.channels.get('403724174532673536')
    botcommands = {'channel':botcommands}
    Help('c', botcommands)
    rankedelogames = polytopia.channels.get('511316081160355852')
    rankedelogames = {'channel':rankedelogames}
    Help('c', rankedelogames)
    unrankedgames = polytopia.channels.get('511906353476927498')
    unrankedgames = {'channel':unrankedgames}
    Help('c', unrankedgames)
    elobotcommands = polytopia.channels.get('635091071717867521')
    elobotcommands = {'channel':elobotcommands}
    Help('c', elobotcommands)
}, 10800000); // every 3h (10800000)

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);