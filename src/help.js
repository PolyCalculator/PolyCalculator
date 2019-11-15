const { RichEmbed } = require('discord.js');

module.exports = function (args, message) {
    const notBotChannel = !message.channel.name.includes("bot") || !message.channel.name.includes("command")
    let helpEmbed = new RichEmbed()
            .setColor('#FA8072')
    let descriptionArray = [];

    if (args === "full" || args === "f") {
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
    } else if (args === "test" || args === "t") {
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
    } else if (args.startsWith("calc") || args === "c") {
        helpEmbed.setTitle(`**How to use the \`${prefix}calc\` command**`)
        descriptionArray.push("*Parentheses are optional arguments. Units require 2 characters.*")
        helpEmbed.addField(`Argument structure:`, `\`${prefix}calc (attackerCurrentHP) attackerByName (vet), (defenderCurrentHP) unitByName (vet) (d/w) (nr)\``)
        helpEmbed.addField(`Example`, `Long: \`${prefix}calc 13 warrior vet, 8 rider\`\nShort: \`${prefix}c wa, de\``)
        helpEmbed.addField(`Naval units`,`Naval units are supported. Just add \`bo\`, \`sh\` or \`bs\` to make the unit into the naval unit.\n**Example:** \`${prefix}c 30 gi bs, de sh\``)
        helpEmbed.addField(`Veteran`, `Just add a v to specify either unit as a veteran. See next example.`)
        helpEmbed.addField(`(d/w) argument:`, `It's the defense bonus. Not putting anything would consider it without a defense bonus. \`d\` = defense = x1.5 bonus; \`w\` = wall = x4 bonus.\n**Example:** \`${prefix}c 10 wa v, 8 rider w\``)
        helpEmbed.addField(`(nr) argument:`,`It will prevent retaliation from the defender unit\n**Example:** \`${prefix}c 10 warrior vet, 8 rider w nr\``)
        helpEmbed.setFooter(`alias: ${prefix}c`)
    } else if (args.startsWith("unit") || args === 'u') {
        helpEmbed.setTitle(`**How to use the \`${prefix}units\` command**`)
        descriptionArray.push(`*Units require 2 characters.`)
        helpEmbed.addField(`Usage`,`\`${prefix}units\` to return the list of all available units and \`${prefix}{unit}\` to return the stats for a specific unit`)
        helpEmbed.addField(`**Examples`,`**Example 1:** \`${prefix}units\``)
        descriptionArray.push(`**Example 2:** \`${prefix}warrior\``)
        helpEmbed.setFooter(`alias: ${prefix}u`)
    } else if (args.startsWith("elim") || args === "e") {
        helpEmbed.setTitle(`**How to use the \`${prefix}eliminate\` command**`)
        descriptionArray.push("Allows to put a `?` on either side (attacker or defender) to display the most optimal hp to eliminate units.")
        helpEmbed.addField(`Examples and outcomes`,`\`${prefix}e gi 32, def w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, def w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp`)
        helpEmbed.setFooter(`alias: ${prefix}e`)
    } else {
        helpEmbed.setTitle("**How to use the PolyCalculator bot**")
        descriptionArray.push("*Parentheses are optional arguments. Units require 2 characters.*")
        helpEmbed.addField("Main command", `**${prefix}calc:** calculate the outcome of a fight in the most intuitive format.`)
        helpEmbed.addField(`Advanced commands`, `**${prefix}elim:** displays the most effective way to kill a unit.\n**${prefix}full:** calculate the outcome of a fight by specifying all the stats.\n**${prefix}test:** same as \`full\` without the stats restrictions.\n**${prefix}units:** show the list of all available units.\n**${prefix}credits:** show the credits.`)
        helpEmbed.addField("Examples", `\`${prefix}c wa, de\`\n\`${prefix}e gi ?, def 5 w\`\n\`${prefix}e gi 28, def w ?\``)
        helpEmbed.addField("Features", "It supports veteran status (with `v`), naval units (with `bo`, `sh` or `bs`), defense bonus (with `d` or `w`) and no-retaliation (by adding `nr` on the defender side).")
        helpEmbed.addField(`For more details`, `\`${prefix}help {command}\` followed by the the command you want help with\n**Example:** \`${prefix}help c\``)
    }
    helpEmbed.setDescription(descriptionArray);
    return message.channel.send(helpEmbed)
        .then(x => {
            if(notBotChannel) {
                x.delete(60000)
                    .then(x => console.log("Response deleted after 1 min"))
                    .catch(console.error)
                message.delete(60000)
                    .then(x => console.log("Message deleted after 1 min"))
                    .catch(console.error)
            }
        })
        .catch(console.error) 
}