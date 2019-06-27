require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();

const express = require('express');
var app = express();

class Fight {
    constructor(ahp, amaxhp, aattack, dhp, dmaxhp, dattack, def) {
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

    if (cmd === "help") {
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setTitle(`How to use the PolyCalculator bot`)
            .addField("**What each numbers mean:**", `! attackerCurrentHP attackerMaxHP attack defenderCurrentHP defenderMaxHP defense (defense/wall)`)
            .addField("**1st example:**", `! 10 10 2 10 10 2`)
            .addField("**The last argument details:**", `It's the defense bonus. Not putting anything would consider it without a defense bonus. d = x1.5 bonus; w = x4 bonus.`)
            .addField("**2nd example:**", `! 10 10 2 10 10 2 w`)
        message.channel.send(helpEmbed);
    } else {
        const result = new Fight(Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]),Number(args[5]),args[6])
//        const helpEmbed = new Fight(ahp,amaxhp,aattack,dhp,dmaxhp,dattack)
        message.channel.send(result.calculate());
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