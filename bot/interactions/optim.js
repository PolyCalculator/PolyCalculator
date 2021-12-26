const { SlashCommandBuilder } = require('@discordjs/builders');
const optim = require('../commands/optim')
const { pushIfValue } = require('../util/util')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('optim')
    .setDescription('Optimal calculation of attacks on one defender!')
    .addStringOption(option => option.setName('attacker1').setDescription('Enter an attacker').setRequired(true))
    .addStringOption(option => option.setName('defender').setDescription('Enter an defender').setRequired(true))
    .addStringOption(option => option.setName('attacker2').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker3').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker4').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker5').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker6').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker7').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker8').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker9').setDescription('Enter an attacker'))
    .addStringOption(option => option.setName('attacker10').setDescription('Enter an attacker')),
  async execute(interaction, replyData, dbData) {
    const array = []
    pushIfValue(array, interaction.options.get('attacker1'))
    pushIfValue(array, interaction.options.get('attacker2'))
    pushIfValue(array, interaction.options.get('attacker3'))
    pushIfValue(array, interaction.options.get('attacker4'))
    pushIfValue(array, interaction.options.get('attacker5'))
    pushIfValue(array, interaction.options.get('attacker6'))
    pushIfValue(array, interaction.options.get('attacker7'))
    pushIfValue(array, interaction.options.get('attacker8'))
    pushIfValue(array, interaction.options.get('attacker9'))
    pushIfValue(array, interaction.options.get('attacker10'))
    pushIfValue(array, interaction.options.get('defender'))

    const input = array.join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await optim.execute(interaction, input, replyData, dbData)
  },
};

