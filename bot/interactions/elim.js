const { SlashCommandBuilder } = require('@discordjs/builders')
const elim = require('../commands/elim')

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('e')
        .setDescription(
            "Elim: Use ? on either the attacker or the defender when you don't know the hp!",
        )
        .addStringOption((option) =>
            option
                .setName('attacker')
                .setDescription('Enter an attacker')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('defender')
                .setDescription('Enter an defender')
                .setRequired(true),
        ),
    async execute(interaction, replyData, dbData) {
        const input = `${interaction.options.get('attacker').value}, ${
            interaction.options.get('defender').value
        }`

        dbData.arg = input
        dbData.content = `${interaction.commandName} ${input}`

        return await elim.execute({}, input, replyData, dbData)
    },
}
