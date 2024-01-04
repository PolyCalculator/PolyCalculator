const { SlashCommandBuilder } = require('@discordjs/builders')
const formula = require('../commands/formula')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('formula')
        .setDescription(
            'Get the breakdown of the formula for damage calculator!',
        ),
    async execute(interaction, replyData, dbData) {
        dbData.content = `${interaction.commandName}`

        return await formula.execute({}, '', replyData, dbData)
    },
}
