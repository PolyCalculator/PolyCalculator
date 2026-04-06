const { SlashCommandBuilder } = require('@discordjs/builders')
const optim = require('../commands/optim')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('o')
        .setDescription(
            'Optim: Optimal calculation of attacks on one defender!',
        )
        .addStringOption((option) =>
            option
                .setName('attackers')
                .setDescription('Enter attackers separated by comma')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('defender')
                .setDescription('Enter an defender')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('target')
                .setDescription(
                    'Target HP for defender (e.g. "12" for exact, "<12" for below)',
                )
                .setRequired(false),
        ),
    async execute(interaction, replyData, dbData) {
        const array = []
        array.push(interaction.options.get('attackers'))
        array.push(interaction.options.get('defender'))
        const input = array.map((x) => x.value).join(', ')
        const targetOption = interaction.options.get('target')
        const targetStr = targetOption ? targetOption.value : null

        dbData.arg = input
        dbData.content = `${interaction.commandName} ${input}`

        return await optim.execute(
            interaction,
            input,
            replyData,
            dbData,
            targetStr,
        )
    },
}
