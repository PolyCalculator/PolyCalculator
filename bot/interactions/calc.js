const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  dev: false,
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Replies with Pong!')
    .addStringOption(option => option.setName('attacker1').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker2').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker3').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker4').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker5').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker6').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker7').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker8').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker9').setDescription('Enter a string'))
    .addStringOption(option => option.setName('attacker10').setDescription('Enter a string')),
  async execute(interaction) {
    console.log(interaction)
    await interaction.reply('Pong!');
  },
};