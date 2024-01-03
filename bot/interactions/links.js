const { SlashCommandBuilder } = require('@discordjs/builders');
const links = require('../commands/links');

module.exports = {
    dev: false,
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription(
            "Show the links to invite the bot and to the developer's server!",
        ),
    async execute(interaction, replyData, dbData) {
        dbData.content = `${interaction.commandName}`;

        return await links.execute({}, '', replyData, dbData);
    },
};
