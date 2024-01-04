const { SlashCommandBuilder } = require('@discordjs/builders')
const units = require('../commands/units')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('units')
        .setDescription('If unspecified, lists all units!')
        .addStringOption((option) =>
            option
                .setName('unit')
                .setDescription(
                    'If specified, only stats for the requested unit',
                ),
        ),
    async execute(interaction, replyData, dbData) {
        const input = interaction.options.get('unit')
            ? interaction.options.get('unit').value
            : ''

        dbData.arg = input
        dbData.content = `${interaction.commandName} ${input}`

        return await units.execute({}, input, replyData, dbData)
    },
}
