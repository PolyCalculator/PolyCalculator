const { SlashCommandBuilder } = require('@discordjs/builders');
const units = require('../commands/units')
const { pushIfValue } = require('../util/util')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('units')
    .setDescription('If unspecified, lists all units!')
    .addStringOption(option => option.setName('unit').setDescription('If specified, only stats for the requested unit')),
  async execute(interaction, replyData, dbData) {
    const array = []
    pushIfValue(array, interaction.options.get('unit'))

    const input = array.length === 0 ? '' : array.join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await units.execute({}, input, replyData, dbData)
  },
};

