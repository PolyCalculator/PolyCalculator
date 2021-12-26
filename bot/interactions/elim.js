const { SlashCommandBuilder } = require('@discordjs/builders');
const elim = require('../commands/elim')
const { pushIfValue } = require('../util/util')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('elim')
    .setDescription('Use ? on either the attacker or the defender when you don\'t know the hp!')
    .addStringOption(option => option.setName('attacker').setDescription('Enter an attacker').setRequired(true))
    .addStringOption(option => option.setName('defender').setDescription('Enter an defender').setRequired(true)),
  async execute(interaction, replyData, dbData) {
    const array = []
    pushIfValue(array, interaction.options.get('attacker'))
    pushIfValue(array, interaction.options.get('defender'))

    const input = array.join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await elim.execute({}, input, replyData, dbData)
  },
};

