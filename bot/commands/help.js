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
  category: 'hidden',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, args, embed) {
    args = args.split(/ +/)
    args.shift()
    const { commands } = message.client;

    if (args.length != 0) {
      const cmd = commands.get(args[0]) || commands.find(alias => alias.aliases && alias.aliases.includes(args[0]))
      if (!cmd)
        throw 'This command doesn\'t exist.\nYou can try `.help` to get the list of commands!'

      embed.setTitle(`Help card for \`${process.env.PREFIX}${cmd.name}\``)
        .setDescription(`**Description:** ${cmd.description}`)
      if(cmd.name !== 'elim')
        embed.addField('**Short usage:**', cmd.shortUsage(process.env.PREFIX))
      embed.addField('**Long usage:**', cmd.longUsage(process.env.PREFIX))
      if(cmd.category === 'Main' || cmd.category === 'Advanced') {
        embed.addField('\u200b', '**Other features**')
          .addField('**Naval units:**', 'You can add `bo`, `sh` or `bs` to make the units into their respective naval units')
          .addField('**Veteran:**', 'You can just add a `v` to make the unit veteran. I will also recognize if you input hp higher than the normal and automatically make your unit veteran.')
          .addField('**Defense bonus:**', 'Put `d` for the single bonus defense and `w` for the wall defense bonus.')
          .setFooter(`aliases: ${cmd.aliases}`)
      }
    } else {
      const categoriesMapped = {
        Main: {},
        Advanced: {},
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
        .setFooter('For more help on a command: .help {command}\nExample: .help calc')

      for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
        const field = []
        for (const [name, details] of Object.entries(commandsList)) {
          field.push(`**${name}**: ${details.description}`)
        }
        embed.addField(`**${cat}:**`, field)
      }
    }
    return embed
  },
};