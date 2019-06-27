require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const http = require("http")

setInterval(function() {
    http.get("http://polycalculator.herokuapp.com");
}, 300000); // every 5 minutes (300000)

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
            this.dforce = this.dattack*this.dhp/this.dmaxhp*1.5;
    }
   
    get res() {
        return this.calculate();
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

const allUnits = new Map()
allUnits.set("w", warrior)
allUnits.set("r", rider)
allUnits.set("a", archer)
allUnits.set("d", defender)
allUnits.set("k", knight)
allUnits.set("s", swords)
allUnits.set("g", giant)
allUnits.set("c", catapult)
allUnits.set("t", tridention)
allUnits.set("p", polytaur)
allUnits.set("n", navalon)

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
            .addField("**2nd example:**", "! 10 10 2 10 10 2 w")
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("war") || cmd === "w") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Warrior stats")
            .addField("**Max HP**", warrior.maxhp)
            .addField("**Veteran HP**", warrior.vethp)
            .addField("**Attack**", warrior.att)
            .addField("**Defense**", warrior.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("rider") || cmd === "r") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Rider stats")
            .addField("**Max HP**", rider.maxhp)
            .addField("**Veteran HP**", rider.vethp)
            .addField("**Attack**", rider.att)
            .addField("**Defense**", rider.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("def") || cmd === "d") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Defender stats")
            .addField("**Max HP**", defender.maxhp)
            .addField("**Veteran HP**", defender.vethp)
            .addField("**Attack**", defender.att)
            .addField("**Defense**", defender.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("gia") || cmd === "g") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Giant stats")
            .addField("**Max HP**", giant.maxhp)
            .addField("**Veteran HP**", giant.vethp)
            .addField("**Attack**", giant.att)
            .addField("**Defense**", giant.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("sword") || cmd === "s") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Swordsman stats")
            .addField("**Max HP**", swords.maxhp)
            .addField("**Veteran HP**", swords.vethp)
            .addField("**Attack**", swords.att)
            .addField("**Defense**", swords.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("kni") || cmd === "k") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Knight stats")
            .addField("**Max HP**", knight.maxhp)
            .addField("**Veteran HP**", knight.vethp)
            .addField("**Attack**", knight.att)
            .addField("**Defense**", knight.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("arch") || cmd === "a") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Archer stats")
            .addField("**Max HP**", archer.maxhp)
            .addField("**Veteran HP**", archer.vethp)
            .addField("**Attack**", archer.att)
            .addField("**Defense**", archer.def)
        message.channel.send(helpEmbed);
    } else if (cmd.startsWith("cat") || cmd === "c") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle("Catapult stats")
            .addField("**Max HP**", catapult.maxhp)
            .addField("**Veteran HP**", catapult.vethp)
            .addField("**Attack**", catapult.att)
            .addField("**Defense**", catapult.def)
        message.channel.send(helpEmbed);
    } else if (cmd === "full") {
        const result = new Fight(Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]),Number(args[5]),args[6])
        message.channel.send(result.calculate());
    } else if (cmd === "name") {
        console.log("name: ", allUnits)

        oneIsUnit = allUnits.get(args[1].charAt(0))
        twoIsUnit = allUnits.get(args[4].charAt(0))
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
        
        const result = new Fight(Number(args[0]),unitOneMaxHP,oneIsUnit.att,Number(args[3]),unitTwoMaxHP,twoIsUnit.def,args[6])
        message.channel.send(result.calculate());
    } else if (cmd === "naval") {
        
    }
})
//--------------------------------------
//              END/OTHER
//--------------------------------------
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);