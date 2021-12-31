/* eslint-disable no-console */
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENTID, TOKEN, GUILDID, PRODCLIENTID, PRODTOKEN } = process.env
const fs = require('fs');

const commands = []
const commandFiles = fs.readdirSync('./bot/interactions').filter(file => file.endsWith('.js')/* && !file.endsWith('test.js')*/);

for (const file of commandFiles) {
  const command = require(`./bot/interactions/${file}`)

  commands.push(command.data)
  // commands.push(JSON.stringify(command.data))
  // commands.push(command.data.toJson())
}

if (process.env.NODE_ENV === 'prod') {
  console.log('[PROD] Started refreshing application (/) commands.');
  const rest = new REST({ version: '9' }).setToken(PRODTOKEN);
  (async () => {
    try {
      console.log(commands)
      await rest.put(
        Routes.applicationCommands(PRODCLIENTID),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error)
      console.error(error.rawError.errors[0]);
    }
  })();
} else {
  console.log('[DEV] Started refreshing application (/) commands.');
  const rest = new REST({ version: '9' }).setToken(TOKEN);
  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(CLIENTID, GUILDID),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error)
      console.error(error.rawError.errors[0]);
    }
  })();
}