require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http");
const { getFightUnit, getUnit, getUnits, getBonus, getRetaliation, getCurrentHP, getMaxHP } = require("./src/units");
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
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)

        args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        let descriptionArray = [];
        if (args[0] === "full" || args[0] === "f") {
            helpEmbed.setTitle(`**How to use the \`${prefix}full\` command**`)
            descriptionArray.push("*Parentheses are optional arguments.*")
            helpEmbed.addField(`Argument structure`,`\`${prefix}full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (d/w) (nr)\``)
            helpEmbed.addField(`Restrictions`,`hp needs between 1 and 40\nattack between 1 and 5\ndefense between 0 and 5.`)
            helpEmbed.addField(`Example`,`\`${prefix}f 10 10 2 10 10 2\``)
            helpEmbed.addField(`(d/w) argument`,`It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.`)
            helpEmbed.addField(`Example`,`\`${prefix}f 10 15 2, 8 10 1 w\``)
            helpEmbed.addField(`(nr) argument`,`It will prevent retaliation from the defender unit`)
            helpEmbed.addField(`Example`,`\`${prefix}f 10 10 2, 8 10 1 w nr\``)
            helpEmbed.setFooter(`alias: ${prefix}f`)
        } else if (args[0] === "test" || args[0] === "t") {
            helpEmbed.setTitle(`**How to use the \`${prefix}test\` command**`)
            descriptionArray.push("*Parentheses are optional arguments.*")
            descriptionArray.push(" ")
            descriptionArray.push("**---------------------------**")
            descriptionArray.push("**No stats restrictions**!")
            descriptionArray.push("**---------------------------**")
            descriptionArray.push(`For the command with possible stats restrictions, try \`${prefix}full\``)
            helpEmbed.addField(`Argument structure`,`\`${prefix}test attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (d/w) (nr)\``)
            helpEmbed.addField(`Example`,`\`${prefix}t 100 100 100 100 100 20\`\n\n**(d/w)** and **(nr)** are still possible.`)
            helpEmbed.setFooter(`alias: ${prefix}t`)
        } else if (args[0].startsWith("calc") || args[0] === "c") {
            helpEmbed.setTitle(`**How to use the \`${prefix}calc\` command**`)
            descriptionArray.push("*Parentheses are optional arguments. Units require 2 characters.*")
            helpEmbed.addField(`Argument structure:`, `\`${prefix}calc (attackerCurrentHP) attackerByName (vet), (defenderCurrentHP) unitByName (vet) (d/w) (nr)\``)
            helpEmbed.addField(`Example`, `Long: \`${prefix}calc 13 warrior vet, 8 rider\`\nShort: \`${prefix}c wa, de\``)
            helpEmbed.addField(`Naval units`,`Naval units are supported. Just add \`bo\`, \`sh\` or \`bs\` to make the unit into the naval unit.\n**Example:** \`${prefix}c 30 gi bs, de sh\``)
            helpEmbed.addField(`Veteran`, `Just add a v to specify either unit as a veteran. See next example.`)
            helpEmbed.addField(`(d/w) argument:`, `It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.\n**Example:** \`${prefix}c 10 wa v, 8 rider w\``)
            helpEmbed.addField(`(nr) argument:`,`It will prevent retaliation from the defender unit\n**Example:** \`${prefix}c 10 warrior vet, 8 rider w nr\``)
            helpEmbed.setFooter(`alias: ${prefix}c`)
        } else if (args[0].startsWith("unit") || args[0] === 'u') {
            helpEmbed.setTitle(`**How to use the \`${prefix}units\` command**`)
            descriptionArray.push(`*Units require 2 characters.`)
            helpEmbed.addField(`Usage`,`\`${prefix}units\` to return the list of all available units and \`${prefix}{unit}\` to return the stats for a specific unit`)
            helpEmbed.addField(`**Examples`,`**Example 1:** \`${prefix}units\``)
            descriptionArray.push(`**Example 2:** \`${prefix}warrior\``)
            helpEmbed.setFooter(`alias: ${prefix}u`)
        } else if (args[0].startsWith("elim") || args[0] === "e") {
            helpEmbed.setTitle(`**How to use the \`${prefix}eliminate\` command**`)
            descriptionArray.push(" ")
            helpEmbed.addField(`On the defender's side`,`A \`?\` on the defender start with the defender hp at max(-1) unitl the defender unit is killed.`)
            helpEmbed.addField(`On the attacker's side`,`A \`?\` on the attacker side starts the attacker hp at 0(+1) until the defending unit is killed.`)
            helpEmbed.addField(`Examples and outcomes`,`\`${prefix}e gi 32, def w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, def w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp`)
            helpEmbed.setFooter(`alias: ${prefix}e`)
        } else {
            helpEmbed.setTitle("**How to use the PolyCalculator bot**")
            descriptionArray.push("*Parentheses are optional arguments. Units require 2 characters.*")
            helpEmbed.addField("Main command", `**${prefix}calc:** calculate the outcome of a fight in the most intuitive format.`)
            helpEmbed.addField(`Advanced commands`, `**${prefix}full:** calculate the outcome of a fight by specifying all the stats.\n**${prefix}full:** calculate the outcome of a fight by specifying all the stats.\n**${prefix}test:** same as \`full\` without the stats restrictions.\n**${prefix}units:** show the list of all available units.\n**${prefix}credits:** show the credits.`)
            helpEmbed.addField("Examples", `\`${prefix}calc wa, de\`\n\`${prefix}full 10 10 2 10 10 1\``)
            helpEmbed.addField("Features", "It supports veteran status (with `v`), naval units (with `bo`, `sh` or `bs`), defense bonus (with `d` or `w`) and no-retaliation (by adding `nr` on the defender side).")
            helpEmbed.addField(`For more details`, `\`${prefix}help calc\` or \`${prefix}help full\``)
        }
        helpEmbed.setDescription(descriptionArray);
        message.channel.send(helpEmbed);
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
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)

        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args.length === 0)
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
    } else if (cmd === "calc" || cmd === 'c' || cmd === "kill" || cmd === 'k') {
        if (message.channel.name.startsWith("general"))
            return message.channel.send(`Come on! Not in **${message.channel.name}**`)
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
        if((cmd === "kill" || cmd === "k")) {
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
        helpEmbed.addField("Developper", "jd (alphaSeahorse)")
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