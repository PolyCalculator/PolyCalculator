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
  execute: function (message, argsStr, replyData/*, dbData*/) {
    const { commands } = message.client;
    const argsArray = argsStr.split(/ +/)
    const command = commands.get(argsArray[0]) || commands.find(alias => alias.aliases && alias.aliases.includes(argsArray[0]))
    let doesntHavePerms

    if (command && command.permsAllowed)
      doesntHavePerms = !(command.permsAllowed.some(x => message.member.hasPermission(x)) || command.usersAllowed.some(x => x === message.author.id))

    if (doesntHavePerms)
      throw 'You don\'t have what it takes to use this :sunglasses:\nYou can try `.help` to get the list of commands!'

    if (argsStr.length != 0 && !doesntHavePerms) {
      if (!command)
        throw `This command doesn't exist.\nGo get some \`${process.env.PREFIX}help\`!`

      replyData.discord.title = `Help card for \`${process.env.PREFIX}${command.name}\``
      replyData.discord.description = `**Description:** ${command.description}`
      if (command.name !== 'elim')
        replyData.discord.fields.push({ name: '**Short usage:**', value: command.shortUsage(process.env.PREFIX) })
      replyData.discord.fields.push({ name: '**Long usage:**', value: command.longUsage(process.env.PREFIX) })
      replyData.discord.footer = `aliases: ${command.aliases.join(', ')}`
      if (command.category === 'Main' || command.category === 'Advanced') {
        replyData.discord.fields.push({ name: '\u200b', value: '**Other features**' })
        replyData.discord.fields.push({ name: 'Naval unit codes to add to land units:', value: 'Boat: `bo`\nShip: `sh`\nBattleship: `bs`' })
        replyData.discord.fields.push({ name: 'Current hp:', value: 'Any number will be interpreted as current hp with a bunch of fail-safes' })
        replyData.discord.fields.push({ name: 'Modifiers:', value: 'Veteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`' })
      }
      if (command.name === 'optim') {
        replyData.discord.fields.push({ name: '`.o` specific modifier:', value: 'Only combos with that/those unit(s) doing the final hit: `f`' })
      }
      return replyData
    } else {
      const categoriesMapped = {
        Main: {},
        Advanced: {},
        // Paid: {},
        Settings: {},
        Other: {}
      }

      commands.forEach(cmd => {
        if (cmd.category === 'hidden')
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

      replyData.discord.title = ('Help card for all commands')
      replyData.discord.footer = (`For more help on a command: ${process.env.PREFIX}help {command}\nExample: ${process.env.PREFIX}help calc`)

      for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
        const field = []
        for (const [name, details] of Object.entries(commandsList)) {
          field.push(`**${name}**: ${details.description}`)
        }
        replyData.discord.fields.push({ name: `**${cat}:**`, value: field })
      }

      return replyData
    }
  }
};