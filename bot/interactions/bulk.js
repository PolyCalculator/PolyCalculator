const { SlashCommandBuilder } = require('@discordjs/builders');
const bulk = require('../commands/bulk')
const { pushIfValue } = require('../util/util')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('bulk')
    .setDescription('How many of one attacker is needed to kill a defender!')
    .addStringOption(option => option.setName('attacker').setDescription('Enter the attacker').setRequired(true))
    .addStringOption(option => option.setName('defender').setDescription('Enter the defender').setRequired(true)),
  async execute(interaction, replyData, dbData) {
    // const attackers = interaction.options.data.filter(x => x.name.startsWith('attacker'))
    // const defender = interaction.options.data.filter(x => x.name === 'defender')[0]

    const array = []
    pushIfValue(array, interaction.options.get('attacker'))
    pushIfValue(array, interaction.options.get('defender'))

    const input = array.join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await bulk.execute({}, input, replyData, dbData)
  },
};

