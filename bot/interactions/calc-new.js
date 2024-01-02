const { SlashCommandBuilder } = require('@discordjs/builders');
const calcNew = require('../commands/calc-new')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('cn')
        .setDescription('Calc: Sequential calculation of attacks on one defender!')
        .addStringOption(option => option.setName('attackers').setDescription('Enter attackers separated by comma').setRequired(true))
        .addStringOption(option => option.setName('defender').setDescription('Enter a defender').setRequired(true)),
    async execute(interaction, replyData, dbData) {
        const array = []
        array.push(interaction.options.get('attackers'))
        array.push(interaction.options.get('defender'))
        const input = array.map(x => x.value).join(', ')

        dbData.arg = input
        dbData.content = `${interaction.commandName} ${input}`

        return await calcNew.execute({}, input, replyData, dbData)
    },
};

