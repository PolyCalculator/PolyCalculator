require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http");

const express = require('express');
var app = express();

class Fight {
    constructor(aname, ahp, amaxhp, aattack, dname, dhp, dmaxhp, ddef, dbonus, dretal) {
        this.aname = aname
        this.ahp = ahp;
        this.amaxhp = amaxhp;
        this.aattack = aattack;
        this.dname = dname;
        this.dhp = dhp;
        this.dmaxhp = dmaxhp;
        this.ddef = ddef;
        this.dbonus = dbonus;
        this.dretal = dretal;
        this.aforce = this.aattack*this.ahp/this.amaxhp;
        this.dforce = this.ddef*this.dhp/this.dmaxhp*this.dbonus;
    }
  
    calculate() {
        var totaldam = this.aforce+this.dforce;
        var hpdefender = this.dhp - Math.round(this.aforce / totaldam * this.aattack * 4.5);
        var hpattacker
        if(hpdefender <= 0) {
            hpattacker = this.ahp;
            hpdefender = 'DESTROYED'
        } else if(this.dretal === false) {
            hpattacker = this.ahp
            this.aname = this.aname + " (no retaliation)"
        } else {
            hpattacker = this.ahp - Math.round(this.dforce / totaldam * this.ddef * 4.5);
        }

        if(hpattacker <= 0)
            hpattacker = 'DESTROYED';

        console.log(hpattacker, "/", this.aname)
        console.log(hpdefender, "/", this.dname)
        console.log(this.dbonus, "/", this.dretal)

        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .addField(`**${this.aname}**:`, hpattacker)
            .addField(`**${this.dname}**:`, hpdefender)
        return helpEmbed;
    }
}

const warrior = {
    name: "Warrior",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 2
}

const rider = {
    name: "Rider",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const archer = {
    name: "Archer",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const defender = {
    name: "Defender",
    maxhp: 15,
    vethp: 20,
    att: 1,
    def: 3
}

const knight = {
    name: "Knight",
    maxhp: 15,
    vethp: 20,
    att: 3.5,
    def: 1
}

const swords = {
    name: "Swordsman",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3
}

const catapult = {
    name: "Catapult",
    maxhp: 10,
    vethp: 15,
    att: 4,
    def: 0
}

const giant = {
    name: "Giant",
    maxhp: 40,
    vethp: 40,
    att: 5,
    def: 4
}

const crab = {
    name: "Crab",
    maxhp: 40,
    vethp: 40,
    att: 4,
    def: 4
}

const tridention = {
    name: "Tridention",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const polytaur = {
    name: "Polytaur",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const navalon = {
    name: "Navalon",
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const boat = {
    name: "Boat",
    maxhp: undefined,
    vethp: undefined,
    att: 1,
    def: 1
}

const ship = {
    name: "Ship",
    maxhp: undefined,
    vethp: undefined,
    att: 2,
    def: 2
}

const battleship = {
    name: "Battleship",
    maxhp: undefined,
    vethp: undefined,
    att: 4,
    def: 3
}

const gaami = {
    name: "Gaami",
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const mindbender = {
    name: "Mind Bender",
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 1
}

const babydragon = {
    name: "Baby Dragon",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3
}

const firedragon = {
    name: "Fire Dragon",
    maxhp: 20,
    vethp: 20,
    att: 4,
    def: 3
}

const mooni = {
    name: "Mooni",
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 2
}

const battlesled = {
    name: "Battle Sled",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 2
}

const icefortress = {
    name: "Ice Fortress",
    maxhp: 20,
    vethp: 25,
    att: 4,
    def: 3
}

const allUnits = new Map()
allUnits.set("wa", warrior)
    allUnits.set("ri", rider)
    allUnits.set("ar", archer)
    allUnits.set("de", defender)
    allUnits.set("gi", giant)
    allUnits.set("bo", boat)
    allUnits.set("sh", ship)
    allUnits.set("bs", battleship)
    allUnits.set("kn", knight)
    allUnits.set("sw", swords)
    allUnits.set("ga", gaami)
    allUnits.set("ca", catapult)
    allUnits.set("tr", tridention)
    allUnits.set("po", polytaur)
    allUnits.set("na", navalon)
    allUnits.set("cr", crab)
    allUnits.set("mb", mindbender)
    allUnits.set("bd", babydragon)
    allUnits.set("fd", firedragon)
    allUnits.set("mo", mooni)
    allUnits.set("sl", battlesled)
    allUnits.set("if", icefortress)

function getUnit(array) {
    const warrior = {
        name: "Warrior",
        maxhp: 10,
        vethp: 15,
        att: 2,
        def: 2
    }
    
    const rider = {
        name: "Rider",
        maxhp: 10,
        vethp: 15,
        att: 2,
        def: 1
    }
    
    const archer = {
        name: "Archer",
        maxhp: 10,
        vethp: 15,
        att: 2,
        def: 1
    }
    
    const defender = {
        name: "Defender",
        maxhp: 15,
        vethp: 20,
        att: 1,
        def: 3
    }
    
    const knight = {
        name: "Knight",
        maxhp: 15,
        vethp: 20,
        att: 3.5,
        def: 1
    }
    
    const swords = {
        name: "Swordsman",
        maxhp: 15,
        vethp: 20,
        att: 3,
        def: 3
    }
    
    const catapult = {
        name: "Catapult",
        maxhp: 10,
        vethp: 15,
        att: 4,
        def: 0
    }
    
    const giant = {
        name: "Giant",
        maxhp: 40,
        vethp: 40,
        att: 5,
        def: 4
    }
    
    const crab = {
        name: "Crab",
        maxhp: 40,
        vethp: 40,
        att: 4,
        def: 4
    }
    
    const tridention = {
        name: "Tridention",
        maxhp: 15,
        vethp: 20,
        att: 3,
        def: 1
    }
    
    const polytaur = {
        name: "Polytaur",
        maxhp: 15,
        vethp: 20,
        att: 3,
        def: 1
    }
    
    const navalon = {
        name: "Navalon",
        maxhp: 30,
        vethp: 30,
        att: 4,
        def: 4
    }
    
    const boat = {
        name: "Boat",
        maxhp: undefined,
        vethp: undefined,
        att: 1,
        def: 1
    }
    
    const ship = {
        name: "Ship",
        maxhp: undefined,
        vethp: undefined,
        att: 2,
        def: 2
    }
    
    const battleship = {
        name: "Battleship",
        maxhp: undefined,
        vethp: undefined,
        att: 4,
        def: 3
    }
    
    const gaami = {
        name: "Gaami",
        maxhp: 30,
        vethp: 30,
        att: 4,
        def: 4
    }
    
    const mindbender = {
        name: "Mind Bender",
        maxhp: 10,
        vethp: 10,
        att: 0,
        def: 1
    }
    
    const babydragon = {
        name: "Baby Dragon",
        maxhp: 15,
        vethp: 20,
        att: 3,
        def: 3
    }
    
    const firedragon = {
        name: "Fire Dragon",
        maxhp: 20,
        vethp: 20,
        att: 4,
        def: 3
    }
    
    const mooni = {
        name: "Mooni",
        maxhp: 10,
        vethp: 10,
        att: 0,
        def: 2
    }
    
    const battlesled = {
        name: "Battle Sled",
        maxhp: 15,
        vethp: 20,
        att: 3,
        def: 2
    }
    
    const icefortress = {
        name: "Ice Fortress",
        maxhp: 20,
        vethp: 25,
        att: 4,
        def: 3
    }

    const allUnits = new Map()
    allUnits.set("wa", warrior)
    allUnits.set("ri", rider)
    allUnits.set("ar", archer)
    allUnits.set("de", defender)
    allUnits.set("gi", giant)
    allUnits.set("bo", boat)
    allUnits.set("sh", ship)
    allUnits.set("bs", battleship)
    allUnits.set("kn", knight)
    allUnits.set("sw", swords)
    allUnits.set("ga", gaami)
    allUnits.set("ca", catapult)
    allUnits.set("tr", tridention)
    allUnits.set("po", polytaur)
    allUnits.set("na", navalon)
    allUnits.set("cr", crab)
    allUnits.set("mb", mindbender)
    allUnits.set("bd", babydragon)
    allUnits.set("fd", firedragon)
    allUnits.set("mo", mooni)
    allUnits.set("sl", battlesled)
    allUnits.set("if", icefortress)

    unitKeys = Array.from(allUnits.keys());
    let unitKey = array.filter(value => unitKeys.includes(value.substring(0,2)))
    unitKey = unitKey.toString().substring(0,2)
    unit = allUnits.get(unitKey)

    if(unit) {
        if(array.some(x => x.startsWith("bo"))) {
            unit.name = unit.name + " Boat";
            unit.att = 1;
            unit.def = 1;
        } else if(array.some(x => x.startsWith("sh"))) {
            unit.name = unit.name + " Ship";
            unit.att = 2;
            unit.def = 2;
        } else if(array.some(x => (x.startsWith("ba") || x.startsWith("bs")))) {
            unit.name = unit.name + " Battleship";
            unit.att = 4;
            unit.def = 3;
        }
        return unit
    } else
        return undefined
}

function getMaxHP(array, unit) {
    if(array.some(x => x.startsWith('v'))) {
        return unit.vethp;
    } else {
        return unit.maxhp;
    }
}

function getCurrentHP(array, maxhp, message) {
    if(array.some(x => !isNaN(Number(x)))) {
        index = array.findIndex(x => !isNaN(Number(x)))
        currenthp = parseInt(array[index])
        if(currenthp > maxhp) {
            message.channel.send(`You have inputed a current hp higher than the max hp.\nYou can add a \`v\` (if you haven't already) to get a veteran max hp.\nIn the meantime, this result calculates with the max hp as current hp.`)
            return maxhp
        } else if(currenthp < 1) {
            message.channel.send(`One of the units is already dead. RIP.`)
            return undefined
        } else
            return currenthp
            
    } else {
        return maxhp
    }   
}

function getBonus(array, unit, message) {
    if(array.some(x => x === 'w') && array.some(x => x === 'd'))
        message.channel.send("You've put both `d` and `w`. By default, it'll take `w` over `d` if it's present.")
    if(array.some(x => x === 'w')) {
        unit.name = unit.name + " (walled)"
        return 4;
    } else if(array.some(x => x === 'd')) {
        unit.name = unit.name + " (protected)"
        return 1.5;
    } else {
        return 1;
    }
}

function getRetaliation(array) {
    if(array.some(x => x === 'nr'))
        return false;
    else
        return true;
}

bot.on('ready', () => {
    const prefix = process.env.PREFIX;
    console.log(`Logged in as ${bot.user.username}`);

    
    module.exports = bot;
    bot.user.setActivity(`prefix: ${prefix}`, { type: 'LISTENING' });
});

//--------------------------------------
//
//          EVENT ON MESSAGE
//
//--------------------------------------
bot.on('message', message => {
    prefix = process.env.PREFIX;

    if(message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
        return;
    else if (message.channel.name.startsWith("general") || message.channel.name.startsWith("crawnv")) {
        message.channel.send('Come on! Not in **#general** or **#crawnversation**');
        return
    }
    
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();
    console.log(`${message.cleanContent} in ${message.guild.name.toUpperCase()} in #${message.channel.name} by ${message.author.tag}`);
    let args;

    //INSIDER
    if(message.channel.name === "insider-information") {
        let guilds = message.client.guilds;
        if(cmd === "guilds")
            guilds.forEach(x => message.channel.send(x.name))
        if(cmd === "channels") {
            args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
            
            guild = guilds.find(x => {
                return x.name.toLowerCase().includes(args[0].toLowerCase())
            })
    
            filteredChannels = guild.channels.filter(x => {
                patt = new RegExp(/[e][0-9]/, 'i')
                let isChannel = !patt.test(x.name)
                isChannel = isChannel && x.type != "category"
                if(x.parent) {
                    isChannel = isChannel && !x.parent.name.startsWith("archive")
                }
    
                return isChannel
            })
            /*filteredChannels = filteredChannels.filter(x => {
                
            })*/
    
            filteredChannels.forEach(x => {
                message.channel.send(x.name)
            })
        }
        if(cmd === "stats") {
            owners = [];
            i=0;
            guilds.forEach((x) => {
                owners[i] = `**${x.name}**: ${x.owner.user}\n-Number of members: ${x.memberCount}\n-Number of channels: ${x.channels.size}\n\n`
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
        args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        let descriptionArray = [];
        if (args[0] === "full" || args[0] === "f") {
            helpEmbed.setTitle(`How to use the \`${prefix}full\` command`)
            descriptionArray.push("Parentheses are optional arguments.")
            descriptionArray.push(" ")
            descriptionArray.push(`Argument structure: \`${prefix}full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (d/w) (nr)\``)
            descriptionArray.push(" ")
            descriptionArray.push(`Example: \`${prefix}full 10 10 2 10 10 2\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(d/w) argument**: It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.")
            descriptionArray.push(`**Example:** \`${prefix}calc 10 warrior vet, 8 rider w\``)
            descriptionArray.push(" ")
            descriptionArray.push("**(nr)** argument: It will prevent retaliation from the defender unit")
            descriptionArray.push(`**Example:** \`${prefix}calc 10 warrior vet, 8 rider w nr\``)
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
            descriptionArray.push(`**${prefix}units:** show the list of all available units.`)
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
        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        args.shift();
        if(args[0] === undefined || Number(args[0]) > 40 || Number(args[0]) < 1 || Number(args[1]) > 40 || Number(args[1]) < 1 || Number(args[0]) > Number(args[1]) || Number(args[2]) < 0 || Number(args[2]) > 5 || Number(args[3]) > 40 || Number(args[3]) < 1 || Number(args[4]) > 40 || Number(args[4]) < 1 || Number(args[3]) > Number(args[4]) || Number(args[5]) < 0 || Number(args[5]) > 5)
            return message.channel.send(`ERROR: There is a problem with your format, try \`${prefix}help\``)
        let bonus = 1;
        bonus = getBonus(args);
        retal = getRetaliation(args);

        const result = new Fight("Attacker", Number(args[0]),Number(args[1]),Number(args[2]),"Defender",Number(args[3]),Number(args[4]),Number(args[5]),bonus, retal)
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                .CALC COMMAND
//
//--------------------------------------------------
    } else if (cmd === "calc" || cmd === 'c' || cmd === "name" || cmd === 'n') {
//--------------------------------------------------
//          HANDLER TO CLEAN THE CMD ARRAY
//--------------------------------------------------
        args = message.content.toLowerCase().slice(prefix.length);

        if(args.includes("-"))
            units = args.split("-")
        else if(args.includes("/"))
            units = args.split("/")
        else if(args.includes(","))
            units = args.split(",")
        else
            return message.channel.send("You need an attacker and a defender separated using `-`, `,` or `/`");

        preAttacker = units[0].split(/ +/);
        preAttacker.shift()
        preAttacker = preAttacker.filter(x => x != "");
        preDefender = units[1].split(/ +/);
        preDefender = preDefender.filter(x => x != "");

//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        attackerUnit = {
            name: undefined,
            currentHP: undefined,
            maxHP: undefined,
            att: undefined
        }
        defenderUnit = {
            name: undefined,
            currentHP: undefined,
            maxHP: undefined,
            def: undefined,
            bonus: 1,
            retaliation: true
        }

        attackerStats = getUnit(preAttacker)
        if(attackerStats === undefined)
            return message.channel.send(`**ERROR:** We couldn't find a unit in our database for your **attacker**.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nFor naval units, make sure you include which unit is in.\n   Ex long: \`${prefix}calc boat warrior vet, ship warrior\`\n   Ex court: \`${prefix}calc bo wa v, sh wa\``)
        attackerUnit.name = attackerStats.name;
        attackerUnit.att = attackerStats.att;
        attackerUnit.maxHP = getMaxHP(preAttacker, attackerStats);
        attackerUnit.currentHP = getCurrentHP(preAttacker, attackerUnit.maxHP, message);
        if(attackerUnit.currentHP === undefined)
            return

        defenderStats = getUnit(preDefender)
        if(defenderStats === undefined)
            return message.channel.send(`**ERROR:** We couldn't find a unit in our database for your **defender**.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nFor naval units, make sure you include which unit is in.\n   Ex long: \`${prefix}calc boat warrior vet, ship warrior\`\n   Ex court: \`${prefix}calc bo wa v, sh wa\``)
        defenderUnit.name = defenderStats.name;
        defenderUnit.def = defenderStats.def;
        defenderUnit.maxHP = getMaxHP(preDefender, defenderStats);
        defenderUnit.currentHP = getCurrentHP(preDefender, defenderUnit.maxHP, message);
        if(defenderUnit.currentHP === undefined)
            return
        defenderUnit.bonus = getBonus(preDefender, defenderUnit, message);
        defenderUnit.retaliation = getRetaliation(preDefender);

        const result = new Fight(attackerUnit.name, attackerUnit.currentHP, attackerUnit.maxHP, attackerUnit.att,defenderUnit.name, defenderUnit.currentHP, defenderUnit.maxHP, defenderUnit.def, defenderUnit.bonus, defenderUnit.retaliation)
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                .{UNIT} STATS COMMANDS
//
//--------------------------------------------------
    } else {
        unitKeysArray = Array.from(allUnits.keys())
        keyIndex = unitKeysArray.findIndex(x => cmd.substring(0, 2) === x)
        unitHelp = allUnits.get(unitKeysArray[keyIndex])

        if(unitHelp) {
            const helpEmbed = new RichEmbed()
                .setColor('#FA8072')
            let descriptionArray = [];
            Object.keys(unitHelp).forEach(x => {
                if(x === 'name')
                    helpEmbed.setTitle(`**${unitHelp[x]}**`)
                else
                    descriptionArray.push(`**${x}**: ${unitHelp[x]}`)
            })
            helpEmbed.setDescription(descriptionArray);
            message.channel.send(helpEmbed)
                .then(() => {})
                .catch(console.error)
        } /*else {
//--------------------------------------------------
//               IF NO KNOWN COMMANDS
//--------------------------------------------------
            return message.channel.send("It seems we don't have that command. If you think it should exist, DM @**jd#0001**!"); 
        }*/
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