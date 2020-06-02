const dbStats = require('../../db/index')

module.exports = {
  name: 'aliases',
  description: 'list all aliases to simplify your life.',
  aliases: ['alias', 'a'],
  shortUsage(prefix) {
    return `${prefix}a`
  },
  longUsage(prefix) {
    return `${prefix}alias`
  },
  forceNoDelete: false,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    const categoriesMapped = {
      Main: {},
      Advanced: {},
      Settings: {},
      Other: {}
    }

    message.client.commands.forEach(cmd => {
      if(cmd.category === 'hidden')
        return

      const category = categoriesMapped[cmd.category]

      category[cmd.name] = {
        aliases: cmd.aliases,
      }
    })

    embed.setTitle('All aliases')
      .setDescription('To simplify your life!')

    for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
      const field = []
      for (const [name, details] of Object.entries(commandsList)) {
        field.push(`**${process.env.PREFIX}${name}**: \`${process.env.PREFIX}${details.aliases.join(`\`, \`${process.env.PREFIX}`)}\``)
      }
      embed.addField(`**${cat}:**`, field)
    }

    data.command = this.name
    data.attacker = undefined
    data.defender = undefined
    data.is_attacker_vet = undefined
    data.is_defender_vet = undefined
    data.attacker_description = undefined
    data.defender_description = undefined
    data.reply_fields = undefined

    return embed
  }
};