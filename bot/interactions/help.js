const { SlashCommandBuilder } = require('@discordjs/builders');
const help = require('../commands/help')
const { pushIfValue } = require('../util/util')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('If unspecified, lists all commands!')
    .addStringOption(option => option.setName('command').setDescription('If specified, only details for the requested unit')),
  async execute(interaction, replyData, dbData) {
    // const attackers = interaction.options.data.filter(x => x.name.startsWith('attacker'))
    // const defender = interaction.options.data.filter(x => x.name === 'defender')[0]

    const array = []
    pushIfValue(array, interaction.options.get('command'))

    const input = array.length === 0 ? '' : array.join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await help.execute(interaction, input, replyData, dbData)
  },
};

