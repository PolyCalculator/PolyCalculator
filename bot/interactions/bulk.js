const { SlashCommandBuilder } = require('@discordjs/builders');
const bulk = require('../commands/bulk')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('b')
    .setDescription('Bulk: How many of one attacker is needed to kill a defender!')
    .addStringOption(option => option.setName('attacker').setDescription('Enter the attacker').setRequired(true))
    .addStringOption(option => option.setName('defender').setDescription('Enter the defender').setRequired(true)),
  async execute(interaction, replyData, dbData) {
    const input = `${interaction.options.get('attacker').value}, ${interaction.options.get('defender').value}`

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input} `

    return await bulk.execute({}, input, replyData, dbData)
  },
};

