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
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)

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

        unitEmbed = new RichEmbed();
        unitEmbed.setColor('#FA8072')
            .setTitle("All units by code")
        units = [];

        allUnits = getUnits();
        Object.keys(allUnits).forEach(function (key) {
            units.push(`${allUnits[key].name}: ${key}`)
        });
        
        unitEmbed.setDescription(units);
        message.channel.send(unitEmbed);
//--------------------------------------------------
//
//                .FULL COMMAND
//
//--------------------------------------------------
    } else if (cmd === "full" || cmd === "f") {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();

        if(args.length === 0)
            return Help(cmd, message)

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
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args.length === 0)
            return Help(cmd, message)
                
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
    } else if (cmd === "calc" || cmd === 'c' || cmd.startsWith("elim") || cmd === 'e') {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
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
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`");

        attackerArray = unitsArray[0].split(/ +/).filter(x => x != "")
        defenderArray = unitsArray[1].split(/ +/).filter(x => x != "")

        if(attackerArray.length === 0 || defenderArray.length === 0)
            return message.channel.send("You need an attacker and a defender separated using `,` or `/`");
//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        try {
            attackerStats = getFightUnit(attackerArray)
            defenderStats = getFightUnit(defenderArray)
        } catch (error) {
            console.log("ERROR:", error)
            return message.channel.send(`**ERROR:** ${error}`)
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

        if((cmd.startsWith("elim") || cmd === "e")) {
            if(attackerArray.some(x => x.includes('?')) && defenderArray.some(x => x.includes('?'))) {
                message.channel.send(`*Note that any hp input will be disregarded.*`)
                message.channel.send(result.provideDefHP());
                message.channel.send(result.provideAttHP());
            } else if(attackerArray.some(x => x.includes('?')))
                message.channel.send(result.provideDefHP());
            else if(defenderArray.some(x => x.includes('?')))
                message.channel.send(result.provideAttHP());
            else
                message.channel.send(`You are looking for the \`${prefix}c\` command.\n\`${prefix}k\` is used to display the necessary hp of a unit to kill another. Try \`${prefix}help k\` for more information.`);
        } else
            message.channel.send(result.calculate());
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
//--------------------------------------------------
//
//                .{UNIT} COMMAND
//
//--------------------------------------------------
    } else {
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
                .then(() => {})
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

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);