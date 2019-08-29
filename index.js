require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http");
const { getFightUnit, getUnit, getBonus, getRetaliation, getCurrentHP, getMaxHP } = require("./src/units");
const Fight = require("./src/fight");

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
            message.channel.send(owners)
        }
    }
//--------------------------------------------------
//
//                 .HELP COMMAND
//
//--------------------------------------------------
    if (cmd === "help") {
        if (message.channel.name.startsWith("general")) {
            message.channel.send(`Come on! Not in **${message.channel.name}**`);
            return
        }
        args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        let descriptionArray = [];
        if (args[0] === "full" || args[0] === "f") {
            helpEmbed.setTitle(`How to use the \`${prefix}full\` command`)
            descriptionArray.push("Parentheses are optional arguments.")
            descriptionArray.push(" ")
            descriptionArray.push(`**Argument structure**/: \`${prefix}full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (d/w) (nr)\``)
            descriptionArray.push(" ")
            descriptionArray.push("**Restrictions**: hp between 1 and 40, attack between 1 and 5 and defense between 0 and 5.")
            descriptionArray.push(" ")
            descriptionArray.push(`**Example**: \`${prefix}full 10 10 2 10 10 2\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(d/w) argument**: It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.")
            descriptionArray.push(`**Example:** \`${prefix}full 10 15 2, 8 10 1 w\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(nr)** argument: It will prevent retaliation from the defender unit")
            descriptionArray.push(`**Example:** \`${prefix}full 10 10 2, 8 10 1 w nr\``)
        } else if (args[0] === "test" || args[0] === "t") {
            helpEmbed.setTitle(`How to use the \`${prefix}test\` command`)
            descriptionArray.push("Parentheses are optional arguments.")
            descriptionArray.push(" ")
            descriptionArray.push(`**Argument structure**/: \`${prefix}test attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (d/w) (nr)\``)
            descriptionArray.push(" ")
            descriptionArray.push("**---------------------------**")
            descriptionArray.push("**No stats restrictions**!")
            descriptionArray.push("**---------------------------**")
            descriptionArray.push(" ")
            descriptionArray.push(`**Example**: \`${prefix}test 100 100 100 100 100 20\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(d/w)** and **(nr)** are still possible.")
            descriptionArray.push(` `)
            descriptionArray.push(`*For the command with possible stats restrictions, try \`${prefix}full\`*`)
        } else if (args[0].startsWith("calc") || args[0] === "c") {
            helpEmbed.setTitle(`How to use the \`${prefix}calc\` command`)
            descriptionArray.push("Parentheses are optional arguments. Units require 2 characters.")
            descriptionArray.push(" ")
            descriptionArray.push(`**Argument structure:** \`${prefix}calc (attackerCurrentHP) attackerByName (vet), (defenderCurrentHP) unitByName (vet) (d/w) (nr)\``)
            descriptionArray.push(" ")
            descriptionArray.push(`**Long example**: \`${prefix}calc 13 warrior vet, 8 rider\``)
            descriptionArray.push(`**Short example**: \`${prefix}calc wa, de\``)
            descriptionArray.push(" ")
            descriptionArray.push("**Naval units**: Naval units are supported. Just add `bo`, `sh` or `bs` to make the unit into the naval unit.")
            descriptionArray.push(`**Short example**: \`${prefix}calc 30 gi bs, de sh\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(d/w) argument:** It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.")
            descriptionArray.push(`**Example:** \`${prefix}calc 10 warrior vet, 8 rider w\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(nr) argument:** It will prevent retaliation from the defender unit")
            descriptionArray.push(`**Example:** \`${prefix}calc 10 warrior vet, 8 rider w nr\``)
            helpEmbed.setFooter(`alias: ${prefix}c`)
        } else if (args[0].startsWith("units")) {
            helpEmbed.setTitle(`How to use the \`${prefix}units\` command`)
            descriptionArray.push("Units require 2 characters.")
            descriptionArray.push(" ")
            descriptionArray.push(`You can use \`${prefix}units\` to return the list of all available units or use \`${prefix}{unit}\` to return the stats for a specific unit`)
            descriptionArray.push(" ")
            descriptionArray.push(`**Example 1:** \`${prefix}units\``)
            descriptionArray.push(`**Example 1:** \`${prefix}warrior\``)
        } else {
            helpEmbed.setTitle("How to use the PolyCalculator bot")
            descriptionArray.push("Parentheses are optional arguments. Units require 2 characters.")
            descriptionArray.push(" ")
            descriptionArray.push("**Commands:**")
            descriptionArray.push(`**${prefix}calc:** calculate the outcome of a fight in the most intuitive format.`)
            descriptionArray.push(`**${prefix}full:** calculate the outcome of a fight by specifying all the stats.`)
            descriptionArray.push(`**${prefix}test:** same as \`full\` without the stats restrictions.`)
            descriptionArray.push(`**${prefix}units:** show the list of all available units.`)
            descriptionArray.push(`**${prefix}credits:** show the credits.`)
            descriptionArray.push(" ")
            descriptionArray.push("**Examples:**")
            descriptionArray.push(`\`${prefix}calc wa, de\``)
            descriptionArray.push(`\`${prefix}full 10 10 2 10 10 1\``)
            descriptionArray.push(" ")
            descriptionArray.push("**Features:**")
            descriptionArray.push("It supports veteran status (with `v`), naval units (with `bo`, `sh` or `bs`), defense bonus (with `d` or `w`) and no-retaliation (by adding `nr` on the defender side).")
            descriptionArray.push(" ")
            descriptionArray.push(`**For more details**: \`${prefix}help calc\` or \`${prefix}help full\``)
        }
        helpEmbed.setDescription(descriptionArray);
        message.channel.send(helpEmbed);
//--------------------------------------------------
//
//                 .UNITS COMMAND
//
//--------------------------------------------------
    } else if (cmd.startsWith("unit")) {
        if (message.channel.name.startsWith("general")) {
            message.channel.send(`Come on! Not in **${message.channel.name}**`);
            return
        }
        unitEmbed = new RichEmbed();
        unitEmbed.setColor('#FA8072')
            .setTitle("All units by code")
        units = [];
        allUnits.forEach((val, key) => {
            units.push(`${val.name}: ${key}`)
        })
        unitEmbed.setDescription(units);
        message.channel.send(unitEmbed);
//--------------------------------------------------
//
//                .FULL COMMAND
//
//--------------------------------------------------
    } else if (cmd === "full" || cmd === "f") {
        if (message.channel.name.startsWith("general")) {
            message.channel.send(`Come on! Not in **${message.channel.name}**`);
            return
        }
        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args === undefined)
            return message.channel.send(`You need to provide arguments following the \`${prefix}help full\` structure.`)
        if(isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3]) || isNaN(args[4]) || isNaN(args[5]) || args[0] === undefined || Number(args[0]) > 40 || Number(args[0]) < 1 || Number(args[1]) > 40 || Number(args[1]) < 1 || Number(args[0]) > Number(args[1]) || Number(args[2]) < 1 || Number(args[2]) > 5 || Number(args[3]) > 40 || Number(args[3]) < 1 || Number(args[4]) > 40 || Number(args[4]) < 1 || Number(args[3]) > Number(args[4]) || Number(args[5]) < 0 || Number(args[5]) > 5)
            return message.channel.send(`ERROR: There is a problem with your format, try \`${prefix}help full\``)
        let bonus = 1;
        let defender = {name: "Defender"}
        bonus = getBonus(args, defender);
        retal = getRetaliation(args, defender);

        const result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),"Defender",Number(args[3]),Number(args[4]),Number(args[5]),bonus, retal)
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                .TEST COMMAND
//
//--------------------------------------------------
    } else if (cmd === "test" || cmd === "t") {
        if (message.channel.name.startsWith("general")) {
            message.channel.send(`Come on! Not in **${message.channel.name}**`);
            return
        }
        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args === undefined)
            return message.channel.send(`You need to provide arguments following the \`${prefix}help test\` structure.`)
        let bonus = 1;
        let defender = {name: "Defender"}
        bonus = getBonus(args, defender);
        retal = getRetaliation(args, defender);

        const result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),"Defender",Number(args[3]),Number(args[4]),Number(args[5]),bonus, retal)
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                .CALC COMMAND
//
//--------------------------------------------------
    } else if (cmd === "calc" || cmd === 'c' || cmd === "name" || cmd === 'n') {
        if (message.channel.name.startsWith("general")) {
            message.channel.send(`Come on! Not in **${message.channel.name}**`);
            return
        }
//--------------------------------------------------
//          HANDLER TO CLEAN THE CMD ARRAY
//--------------------------------------------------
        args = message.content.toLowerCase().slice(prefix.length+cmd.length);

        if(args.includes("/"))
            unitsArray = args.split("/")
        else if(args.includes(","))
            unitsArray = args.split(",")
        else
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`");

        attackerArray = unitsArray[0].split(/ +/).filter(x => x != "");
        defenderArray = unitsArray[1].split(/ +/).filter(x => x != "")

//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        try {
            attackerStats = getFightUnit(attackerArray)
            defenderStats = getFightUnit(defenderArray)
        } catch (error) {
            console.log("ERROR:", error)
            return message.channel.send(error)
        }

        finalAttacker = {
            name: attackerStats.name,
            currentHP: getCurrentHP(attackerArray, getMaxHP(attackerArray, attackerStats), message),
            maxHP: getMaxHP(attackerArray, attackerStats),
            att: attackerStats.att
        }
        defBonusVals = getBonus(defenderArray, defenderStats)
        finalDefender = {
            name: `${defenderStats.name}${defBonusVals[1]}`,
            currentHP: getCurrentHP(defenderArray, getMaxHP(defenderArray, defenderStats), message),
            maxHP: getMaxHP(defenderArray, defenderStats),
            def: defenderStats.def,
            bonus: defBonusVals[0],
            retaliation: getRetaliation(defenderArray)
        }

        if(attackerStats.name.toLowerCase() === "mooni" || attackerStats.name.toLowerCase() === "mind bender")
            return message.channel.send(`You know very well that ${attackerStats.name.toLowerCase()}s can't attack...`)

        const result = new Fight(finalAttacker.name, finalAttacker.currentHP, finalAttacker.maxHP, finalAttacker.att,finalDefender.name, finalDefender.currentHP, finalDefender.maxHP, finalDefender.def, finalDefender.bonus, finalDefender.retaliation)
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                 .CREDITS COMMAND
//
//--------------------------------------------------
    } else if (cmd === "credits") {
        helpEmbed = new RichEmbed()
        let descriptionArray = []
        helpEmbed.setColor('#FA8072')
        descriptionArray.push("**Developper:**")
        descriptionArray.push("jd (alphaSeahorse)")
        descriptionArray.push(" ")
        descriptionArray.push("**Contributions:**")
        descriptionArray.push("penile partay, WOPWOP, Cake, James.")
        helpEmbed.setDescription(descriptionArray)
        message.channel.send(helpEmbed)
//--------------------------------------------------
//
//                .{UNIT} COMMAND
//
//--------------------------------------------------
    } else {
        cmd = cmd.substring(0, 2)
        unit = getUnit(cmd)

        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle(unit.name)
        let descriptionArray = [];
        descriptionArray.push(`maxhp: ${unit.maxhp}`)
        descriptionArray.push(`vethp: ${unit.vethp}`)
        descriptionArray.push(`attack: ${unit.att}`)
        descriptionArray.push(`defense: ${unit.def}`)

        helpEmbed.setDescription(descriptionArray);
        message.channel.send(helpEmbed)
            .then(() => {})
            .catch(console.error)
    }
})
//--------------------------------------
//              END/OTHER
//--------------------------------------
const port = process.env.PORT || 5000;

setInterval(function() {
    http.get("http://polycalculator.herokuapp.com");
}, 300000); // every 5 minutes (300000)

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);