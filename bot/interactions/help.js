const { SlashCommandBuilder } = require('@discordjs/builders');
const help = require('../commands/help');

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('If unspecified, lists all commands!')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription(
                    'If specified, only details for the requested unit',
                ),
        ),
    async execute(interaction, replyData, dbData) {
        const input = interaction.options.get('command')
            ? interaction.options.get('command').value
            : '';

        dbData.arg = input;
        dbData.content = `${interaction.commandName} ${input}`;

        return await help.execute(interaction, input, replyData, dbData);
    },
};
