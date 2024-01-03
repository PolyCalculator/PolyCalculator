/* eslint-disable no-console */
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENTID, TOKEN, GUILDID, PRODCLIENTID, PRODTOKEN } = process.env;
const fs = require('fs');

const commands = [];
const commandFiles = fs
    .readdirSync('./bot/interactions')
    .filter((file) => file.endsWith('.js') /* && !file.endsWith('test.js')*/);

for (const file of commandFiles) {
    const command = require(`./bot/interactions/${file}`);

    commands.push(command.data);
    // commands.push(JSON.stringify(command.data))
    // commands.push(command.data.toJson())
}

if (process.env.NODE_ENV === 'prod') {
    console.log('[PROD] Started refreshing application (/) commands.');
    const rest = new REST({ version: '9' }).setToken(PRODTOKEN);
    (async () => {
        try {
            console.log(commands);
            await rest.put(Routes.applicationCommands(PRODCLIENTID), {
                body: commands,
            });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
            console.error(error.rawError.errors[0]);
        }
    })();
} else {
    console.log('[DEV] Started refreshing application (/) commands.');
    const rest = new REST({ version: '9' }).setToken(TOKEN);
    (async () => {
        // const body = commands
        const body = [];
        try {
            await rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {
                body: body,
            });

            if (body == commands)
                console.log(
                    '\x1b[42m',
                    'Successfully reloaded application (/) commands.',
                );
            else console.log('\x1b[41m', 'Removing application (/) commands.');
        } catch (error) {
            console.error(error);
            console.error(error.rawError.errors[0]);
        }
    })();
}
