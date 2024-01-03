const { SlashCommandBuilder } = require('@discordjs/builders');
const feedback = require('../commands/feedback')

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Send feedback to the dev!')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Required feedback message')
        .setRequired(true)),
  async execute(interaction, replyData, dbData) {
    const input = interaction.options.get('message') ? interaction.options.get('message').value : ''

    dbData.arg = input
    dbData.content = `${interaction.commandName} ${input}`

    return await feedback.execute(interaction, input, replyData, dbData)
  },
};

