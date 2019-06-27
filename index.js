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
        if(def === undefined)
            this.dforce = this.dattack*this.dhp/this.dmaxhp;
        else if (def.startsWith("d"))
            this.dforce = this.dattack*this.dhp/this.dmaxhp*1.5;
        else if (def.startsWith("w"))
            this.dforce = this.dattack*this.dhp/this.dmaxhp*4;
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
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 2
}

const rider = {
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const archer = {
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const defender = {
    maxhp: 15,
    vethp: 20,
    att: 1,
    def: 3
}

const knight = {
    maxhp: 15,
    vethp: 20,
    att: 3.5,
    def: 1
}

const swords = {
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3
}

const catapult = {
    maxhp: 10,
    vethp: 15,
    att: 4,
    def: 0
}

const giant = {
    maxhp: 40,
    vethp: 40,
    att: 5,
    def: 4
}

const crab = {
    maxhp: 40,
    vethp: 40,
    att: 4,
    def: 4
}

const tridention = {
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const polytaur = {
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const navalon = {
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const boat = {
    maxhp: 'variable',
    vethp: 'variable',
    att: 1,
    def: 1
}

const ship = {
    maxhp: 'variable',
    vethp: 'variable',
    att: 2,
    def: 2
}

const battleship = {
    maxhp: 'variable',
    vethp: 'variable',
    att: 4,
    def: 3
}

const gaami = {
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const allUnits = new Map()
allUnits.set("wa", warrior)
allUnits.set("w", warrior)
allUnits.set("ri", rider)
allUnits.set("r", rider)
allUnits.set("ar", archer)
allUnits.set("a", archer)
allUnits.set("de", defender)
allUnits.set("d", defender)
allUnits.set("kn", knight)
allUnits.set("k", knight)
allUnits.set("sw", swords)
allUnits.set("s", swords)
allUnits.set("gi", giant)
allUnits.set("g", giant)
allUnits.set("ga", gaami)
allUnits.set("ca", catapult)
allUnits.set("c", catapult)
allUnits.set("tr", tridention)
allUnits.set("t", tridention)
allUnits.set("po", polytaur)
allUnits.set("p", polytaur)
allUnits.set("na", navalon)
allUnits.set("n", navalon)
allUnits.set("cr", crab)

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
    
    const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);

    const cmd = args.shift().toLowerCase();

    console.log("Command triggered!", cmd);

    if (cmd === "help") {
        console.log("Help triggered!");
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("How to use the PolyCalculator bot")
            .addField("**!full** command:", `!full attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (defense/wall)`)
            .addField("**!full** example:", `!full 10 10 2 10 10 2`)
            .addField("**!name** command:", `!name attackerCurrentHP unitByName non-vet/vet defenderCurrentHP unitByName non-vet/vet (defense/wall)`)
            .addField("**!name** example:", `!name 10 warrior vet 10 defender non-vet`)
            .addField("**The last argument details:**", `It's the defense bonus. Not putting anything would consider it without a defense bonus. d = defense = x1.5 bonus; w = wall = x4 bonus.`)
            .addField("**Example:**", "!full 10 10 2 10 10 2 w")
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("w")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Warrior stats")
            .addField("**Max HP**", warrior.maxhp)
            .addField("**Veteran HP**", warrior.vethp)
            .addField("**Attack**", warrior.att)
            .addField("**Defense**", warrior.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("r")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Rider stats")
            .addField("**Max HP**", rider.maxhp)
            .addField("**Veteran HP**", rider.vethp)
            .addField("**Attack**", rider.att)
            .addField("**Defense**", rider.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("t")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Tridention stats")
            .addField("**Max HP**", tridention.maxhp)
            .addField("**Veteran HP**", tridention.vethp)
            .addField("**Attack**", tridention.att)
            .addField("**Defense**", tridention.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("de") || cmd === 'd') {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Defender stats")
            .addField("**Max HP**", defender.maxhp)
            .addField("**Veteran HP**", defender.vethp)
            .addField("**Attack**", defender.att)
            .addField("**Defense**", defender.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("gi") || cmd === 'g') {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Giant stats")
            .addField("**Max HP**", giant.maxhp)
            .addField("**Veteran HP**", giant.vethp)
            .addField("**Attack**", giant.att)
            .addField("**Defense**", giant.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("sw") || cmd === "s") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Swordsman stats")
            .addField("**Max HP**", swords.maxhp)
            .addField("**Veteran HP**", swords.vethp)
            .addField("**Attack**", swords.att)
            .addField("**Defense**", swords.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("k")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Knight stats")
            .addField("**Max HP**", knight.maxhp)
            .addField("**Veteran HP**", knight.vethp)
            .addField("**Attack**", knight.att)
            .addField("**Defense**", knight.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("a")) {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Archer stats")
            .addField("**Max HP**", archer.maxhp)
            .addField("**Veteran HP**", archer.vethp)
            .addField("**Attack**", archer.att)
            .addField("**Defense**", archer.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("ca") || cmd === "c") {
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
    } else if (cmd === "full" || cmd === undefined) {
        const result = new Fight(Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]),Number(args[5]),args[6])
        message.channel.send(result.calculate());
    } else if (cmd === "name") {
        oneIsUnit = allUnits.get(args[1].substr(0,2))
        twoIsUnit = allUnits.get(args[4].substr(0,2))
        if(twoIsUnit === undefined || oneIsUnit === undefined)
        return message.channel.send(`There is a problem with your format, try \`${prefix}help\``)
        console.log("attacker", oneIsUnit);
        console.log("defender", twoIsUnit);
        if(args[2].startsWith("v"))
            unitOneMaxHP = oneIsUnit.vethp
        else if (args[2].startsWith("n"))
            unitOneMaxHP = oneIsUnit.maxhp

        if(args[5].startsWith("v"))
            unitTwoMaxHP = twoIsUnit.vethp
        else if (args[5].startsWith("n"))
            unitTwoMaxHP = twoIsUnit.maxhp
        else
            return message.channel.send(`There is a problem with your format, try \`${prefix}help\``)
        
        const result = new Fight(Number(args[0]),unitOneMaxHP,oneIsUnit.att,Number(args[3]),unitTwoMaxHP,twoIsUnit.def,args[6])
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