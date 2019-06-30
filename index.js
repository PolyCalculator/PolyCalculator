require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http");

const express = require('express');
var app = express();

class Fight {
    constructor(ahp, amaxhp, aattack, dhp, dmaxhp, dattack, def) {
        console.log(ahp, amaxhp, aattack, dhp, dmaxhp, dattack, def)
        this.ahp = ahp;
        this.amaxhp = amaxhp;
        this.aattack = aattack;
        this.dhp = dhp;
        this.dmaxhp = dmaxhp;
        this.dattack = dattack;
        this.aforce = this.aattack*this.ahp/this.amaxhp;
        this.dforce = this.dattack*this.dhp/this.dmaxhp*def;
    }
  
    calculate() {
        var totaldam = this.aforce+this.dforce;
        var hpdefender = this.dhp - Math.round(this.aforce / totaldam * this.aattack * 4.5);
        if(hpdefender <= 0) {
            hpattacker = this.ahp;
            hpdefender = 'DESTROYED'
        }
        else {
            var hpattacker = this.ahp - Math.round(this.dforce / totaldam * this.dattack * 4.5);
        }

        if(hpattacker <= 0)
            hpattacker = 'DESTROYED';

        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .addField("**Attacker :**", hpattacker)
            .addField("**Defender :**", hpdefender)
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

const allUnits = new Map()
allUnits.set("wa", warrior)
allUnits.set("ri", rider)
allUnits.set("ar", archer)
allUnits.set("de", defender)
allUnits.set("kn", knight)
allUnits.set("sw", swords)
allUnits.set("gi", giant)
allUnits.set("ga", gaami)
allUnits.set("ca", catapult)
allUnits.set("tr", tridention)
allUnits.set("po", polytaur)
allUnits.set("na", navalon)
allUnits.set("cr", crab)

function getUnit(array) {
    console.log("array: ", array)
    unitKeys = Array.from(allUnits.keys());
    let unitKey = array.filter(value => unitKeys.includes(value.substring(0,2)))
    unitKey = unitKey.toString().substring(0,2)
    unit = allUnits.get(unitKey)
    if(array.some(x => x.startsWith("bo") && !unit))
        return undefined
    else if(array.some(x => x.startsWith("bo"))) {
        unit.att = 1;
        unit.def = 1;
    }
    if(array.some(x => x.startsWith("sh") && !unit))
        return undefined
    else if(array.some(x => x.startsWith("sh"))) {
        unit.att = 2;
        unit.def = 2;
    }
    if(array.some(x => (x.startsWith("ba") || x.startsWith("bs")) && !unit))
        return undefined
    else if(array.some(x => (x.startsWith("ba") || x.startsWith("bs")))) {
        unit.att = 4;
        unit.def = 3;
    }

    if(unit)
        return unit
    else   
        return undefined
}

function getMaxHP(array, unit) {
    if(array.some(x => x.startsWith('v'))) {
        return unit.vethp;
    } else {
        return unit.maxhp;
    }
}

function getCurrentHP(array, maxhp) {
    if(array.some(x => !isNaN(Number(x)))) {
        index = array.findIndex(x => !isNaN(Number(x)))
        return parseInt(array[index])
    } else {
        return maxhp
    }   
}

function getBonus(array) {
    if(array.some(x => x === 'w')) {
        return 4;
    } else if(array.some(x => x === 'd')) {
        return 1.5;
    } else {
        return 1;
    }
}

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

    if(message.author.bot || !message.content.startsWith(prefix))
        return;
    else if (message.channel.name.startsWith("general") || message.channel.name.startsWith("crawnv")) {
        message.channel.send('Come on! Not in **#general** or **#crawnversation**');
        return
    }
    
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();
    console.log("Command triggered:", cmd);
    let args;

    if (cmd === "help") {
        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        console.log("Help triggered!");
        if (args[0] === "full") {
            helpEmbed.setTitle("How to use the `!full` command")
                .addField("Argument structure:", `!full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (defense/wall)`)
                .addField("Long example:", `!full 10 10 2 10 10 2`)
        } else if (args[0] === "name") {
            helpEmbed.setTitle("How to use the `!name` command")
                .addField("Argument structure:", `!name attackerCurrentHP unitByName non-vet/vet defenderCurrentHP unitByName non-vet/vet (defense/wall)`)
                .addField("Long example:", `!name 10 warrior vet 10 defender non-vet`)
                .addField("Short example:", `!name 10 w v 10 d n`)
        } else {
            helpEmbed.setTitle("How to use the PolyCalculator bot")
                .addField("**!full** command:", `!full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (defense/wall)`)
                .addField("**!full** example:", `!full 10 10 2 10 10 2`)
                .addField("**!name** command:", `!name attackerCurrentHP unitByName non-vet/vet defenderCurrentHP unitByName non-vet/vet (defense/wall)`)
                .addField("**!name** example:", `!name 10 warrior vet 10 defender non-vet`)
                .addField("**Last argument details:**", `It's the defense bonus. Not putting anything would consider it without a defense bonus. d = defense = x1.5 bonus; w = wall = x4 bonus.`)
                .addField("**Example:**", "!full 10 10 2 10 10 2 w")
                .addBlankField()
                .addField("**More details:**", "`!help full` or `!help name`")
        }
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("wa")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Warrior stats")
            .addField("**Max HP**", warrior.maxhp)
            .addField("**Veteran HP**", warrior.vethp)
            .addField("**Attack**", warrior.att)
            .addField("**Defense**", warrior.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ri")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Rider stats")
            .addField("**Max HP**", rider.maxhp)
            .addField("**Veteran HP**", rider.vethp)
            .addField("**Attack**", rider.att)
            .addField("**Defense**", rider.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("tr")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Tridention stats")
            .addField("**Max HP**", tridention.maxhp)
            .addField("**Veteran HP**", tridention.vethp)
            .addField("**Attack**", tridention.att)
            .addField("**Defense**", tridention.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("de")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Defender stats")
            .addField("**Max HP**", defender.maxhp)
            .addField("**Veteran HP**", defender.vethp)
            .addField("**Attack**", defender.att)
            .addField("**Defense**", defender.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("gi")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Giant stats")
            .addField("**Max HP**", giant.maxhp)
            .addField("**Veteran HP**", giant.vethp)
            .addField("**Attack**", giant.att)
            .addField("**Defense**", giant.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("sw")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Swordsman stats")
            .addField("**Max HP**", swords.maxhp)
            .addField("**Veteran HP**", swords.vethp)
            .addField("**Attack**", swords.att)
            .addField("**Defense**", swords.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("kn")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Knight stats")
            .addField("**Max HP**", knight.maxhp)
            .addField("**Veteran HP**", knight.vethp)
            .addField("**Attack**", knight.att)
            .addField("**Defense**", knight.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ar")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Archer stats")
            .addField("**Max HP**", archer.maxhp)
            .addField("**Veteran HP**", archer.vethp)
            .addField("**Attack**", archer.att)
            .addField("**Defense**", archer.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ca")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Catapult stats")
            .addField("**Max HP**", catapult.maxhp)
            .addField("**Veteran HP**", catapult.vethp)
            .addField("**Attack**", catapult.att)
            .addField("**Defense**", catapult.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("cr")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Crab stats")
            .addField("**Max HP**", crab.maxhp)
            .addField("**Veteran HP**", crab.vethp)
            .addField("**Attack**", crab.att)
            .addField("**Defense**", crab.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("bo")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Boat stats")
            .addField("**Max HP**", boat.maxhp)
            .addField("**Veteran HP**", boat.vethp)
            .addField("**Attack**", boat.att)
            .addField("**Defense**", boat.def)
            .addField("**Warning**", "Boat isn't supported by the `!name` command because of the hp variance, but you can use the `!full` command")
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("sh")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Ship stats")
            .addField("**Max HP**", ship.maxhp)
            .addField("**Veteran HP**", ship.vethp)
            .addField("**Attack**", ship.att)
            .addField("**Defense**", ship.def)
            .addField("**Warning**", "Ship isn't supported by the `!name` command because of the hp variance, but you can use the `!full` command")
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ba") || cmd === "bs") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Battleship stats")
            .addField("**Max HP**", battleship.maxhp)
            .addField("**Veteran HP**", battleship.vethp)
            .addField("**Attack**", battleship.att)
            .addField("**Defense**", battleship.def)
            .addField("**Warning**", "Battleship isn't supported by the `!name` command because of the hp variance, but you can use the `!full` command")
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ga")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Gaami stats")
            .addField("**Max HP**", gaami.maxhp)
            .addField("**Veteran HP**", gaami.vethp)
            .addField("**Attack**", gaami.att)
            .addField("**Defense**", gaami.def)
        message.channel.send(helpEmbed);
//--------------------------------------------------
//
//                !FULL COMMAND
//
//--------------------------------------------------
    } else if (cmd === "full" || cmd === undefined) {
        args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        if(args[0] === undefined || Number(args[0]) > 40 || Number(args[0]) < 1 || Number(args[1]) > 40 || Number(args[1]) < 1 || Number(args[0]) > Number(args[1]) || Number(args[2]) < 0 || Number(args[2]) > 5 || Number(args[3]) > 40 || Number(args[3]) < 1 || Number(args[4]) > 40 || Number(args[4]) < 1 || Number(args[3]) > Number(args[4]) || Number(args[5]) < 0 || Number(args[5]) > 5)
            return message.channel.send(`ERROR: There is a problem with your format, try \`${prefix}help\``)
        const result = new Fight(Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]),Number(args[5]),args[6])
        message.channel.send(result.calculate());
//--------------------------------------------------
//
//                !NAME COMMAND
//
//--------------------------------------------------
    } else if (cmd === "name") {
//--------------------------------------------------
//        HANDLER TO CLEAN THE ARRAY
//--------------------------------------------------
        args = message.content.toLowerCase().slice(prefix.length);

        if(args.includes("-"))
            units = args.split("-")
        else if(args.includes("/"))
            units = args.split("/")
        else if(args.includes(","))
            units = args.split(",")
        else
            return message.channel.send("You need to separate the attacker from the defender using a `-`, a `,` or a `/` ");

        preAttacker = units[0].split(/ +/);
        preAttacker.shift()
        preAttacker = preAttacker.filter(x => x != "");
        preDefender = units[1].split(/ +/);
        preDefender = preDefender.filter(x => x != "");

//--------------------------------------------------
//        GET FUNCTIONS TO FIND UNITS STATS
//--------------------------------------------------
        attackerUnit = getUnit(preAttacker)
        if(attackerUnit === undefined)
            return message.channel.send("**ERROR:** We couldn't find a unit in our database for your **attacker**.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nFor naval units, make sure you include which unit is in.\n   Ex long: `!name boat warrior vet, ship warrior`\n   Ex court: `!name bo wa v, sh wa`")
        attackerMaxHP = getMaxHP(preAttacker, attackerUnit);
        attackerCurrentHP = getCurrentHP(preAttacker, attackerUnit.maxhp);
        defenderUnit = getUnit(preDefender)
        if(defenderUnit === undefined)
            return message.channel.send("**ERROR:** We couldn't find a unit in our database for your **attacker**.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nFor naval units, make sure you include which unit is in.\n   Ex long: `!name boat warrior vet, ship warrior`\n   Ex court: `!name bo wa v, sh wa`")
        defenderMaxHP = getMaxHP(preDefender, defenderUnit);
        defenderCurrentHP = getCurrentHP(preDefender, defenderUnit.maxhp);
        defBonus = getBonus(preDefender);

        console.log(attackerCurrentHP, attackerMaxHP, attackerUnit.att);
        console.log(defenderCurrentHP, defenderMaxHP, defenderUnit.def, defBonus);

        const result = new Fight(attackerCurrentHP,attackerMaxHP,attackerUnit.att,defenderCurrentHP,defenderMaxHP,defenderUnit.def,defBonus)
        message.channel.send(result.calculate());
    } else {
        message.channel.send("It seems we don't have that command. If you think it should exist, ping @jd#0001!");
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