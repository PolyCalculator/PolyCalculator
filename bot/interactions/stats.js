const { SlashCommandBuilder } = require('@discordjs/builders');
const stats = require('../commands/stats')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Check PolyCalculator usage (default you)!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('(Default you) or the user for which to see the stats')),
  async execute(interaction, replyData, dbData) {
    const input = interaction.options.get('user') ? interaction.options.get('user') : interaction.member

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await stats.execute(interaction, input, replyData, dbData)
  },
};

