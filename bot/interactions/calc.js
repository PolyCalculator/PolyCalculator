const { SlashCommandBuilder } = require('@discordjs/builders');
const calc = require('../commands/calc')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Sequential calculation of attacks on one defender!')
    .addStringOption(option => option.setName('attackers').setDescription('Enter attackers separated by comma').setRequired(true))
    .addStringOption(option => option.setName('defender').setDescription('Enter a defender').setRequired(true)),
  async execute(interaction, replyData, dbData) {
    const array = []
    array.push(interaction.options.get('attackers'))
    array.push(interaction.options.get('defender'))
    const input = array.map(x => x.value).join(', ')

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await calc.execute({}, input, replyData, dbData)
  },
};

