const dbStats = require('../../db/index')

module.exports = {
  name: 'help',
  description: 'display all the commands\' details.',
  aliases: ['commands', 'command', 'h'],
  shortUsage(prefix) {
    return `${prefix}help {command}`
  },
  longUsage(prefix) {
    return `${prefix}h {command}`
  },
  forceNoDelete: false,
  category: 'hidden',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function(message, argsStr, embed, trashEmoji, data) {
    const { commands } = message.client;
    const argsArray = argsStr.split(/ +/)
    const command = commands.get(argsArray[0]) || commands.find(alias => alias.aliases && alias.aliases.includes(argsArray[0]))
    let doesntHavePerms

    if(command && command.permsAllowed)
      doesntHavePerms = !(command.permsAllowed.some(x => message.member.hasPermission(x)) || command.usersAllowed.some(x => x === message.author.id))

    if(doesntHavePerms)
      throw 'You don\'t have what it takes to use this :sunglasses:\nYou can try `.help` to get the list of commands!'

    data.command = this.name
    data.attacker = undefined
    data.defender = undefined
    data.is_attacker_vet = undefined
    data.is_defender_vet = undefined
    data.attacker_description = undefined
    data.defender_description = undefined
    data.reply_fields = undefined

    if (argsStr.length != 0 && !doesntHavePerms) {
      if (!command)
        throw `This command doesn't exist.\nGo get some \`${process.env.PREFIX}help\`!`

      embed.setTitle(`Help card for \`${process.env.PREFIX}${command.name}\``)
        .setDescription(`**Description:** ${command.description}`)
      if(command.name !== 'elim')
        embed.addField('**Short usage:**', command.shortUsage(process.env.PREFIX))
      embed.addField('**Long usage:**', command.longUsage(process.env.PREFIX))
        .setFooter(`aliases: ${command.aliases.join(', ')}`)
      if(command.category === 'Main' || command.category === 'Advanced') {
        embed.addField('\u200b', '**Other features**')
          .addField('Naval unit codes to add to land units:', 'Boat: `bo`\nShip: `sh`\nBattleship: `bs`')
          .addField('Current hp:', 'Any number will be interpreted as current hp with a bunch of fail-safes')
          .addField('Modifiers:', 'Veteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`')
      }
      if(command.name === 'optim') {
        embed.addField('`.o` specific modifier:', 'Only combos with that/those unit(s) doing the final hit: `f`')
      }
      return embed
    } else {
      const categoriesMapped = {
        Main: {},
        Advanced: {},
        // Paid: {},
        Settings: {},
        Other: {}
      }

      commands.forEach(cmd => {
        if(cmd.category === 'hidden')
          return

        const category = categoriesMapped[cmd.category]

        category[cmd.name] = {
          name: cmd.name,
          description: cmd.description,
          aliases: cmd.aliases,
          shortUsage: cmd.shortUsage(process.env.PREFIX),
          longUsage: cmd.longUsage(process.env.PREFIX)
        }
      })

      embed.setTitle('Help card for all commands')
        .setFooter(`For more help on a command: ${process.env.PREFIX}help {command}\nExample: ${process.env.PREFIX}help calc`)

      for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
        const field = []
        for (const [name, details] of Object.entries(commandsList)) {
          field.push(`**${name}**: ${details.description}`)
        }
        embed.addField(`**${cat}:**`, field)
      }

      return embed
    }
  }
};