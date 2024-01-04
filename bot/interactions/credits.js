const { SlashCommandBuilder } = require('@discordjs/builders')
const credits = require('../commands/credits')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('PolyCalculator bot credits!'),
    async execute(interaction, replyData, dbData) {
        dbData.content = `${interaction.commandName}`

        return await credits.execute({}, '', replyData, dbData)
    },
}
