const { SlashCommandBuilder } = require('@discordjs/builders');
const optim = require('../commands/optim-new')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('o')
        .setDescription('Optim: Optimal calculation of attacks on one defender!')
        .addStringOption(option => option.setName('attackers').setDescription('Enter attackers separated by comma').setRequired(true))
        .addStringOption(option => option.setName('defender').setDescription('Enter an defender').setRequired(true)),
    async execute(interaction, replyData, dbData) {
        const array = []
        array.push(interaction.options.get('attackers'))
        array.push(interaction.options.get('defender'))
        const input = array.map(x => x.value).join(', ')

        dbData.arg = input
        dbData.content = `${interaction.commandName} ${input}`

        return await optim.execute(interaction, input, replyData, dbData)
    },
};

