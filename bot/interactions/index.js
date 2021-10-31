/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENTID, TOKEN, GUILDID } = process.env

const commands = []
const commandFiles = fs.readdirSync('./bot/interactions').filter(file => file.endsWith('.js') && !file.endsWith('index.js'));

for (const file of commandFiles) {
  const command = require(`./${file}`)
  commands.push(command)
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

if (process.env.NODE_ENV === 'dev') {
  (async () => {
    try {
      console.log('[DEV] Started refreshing application (/) commands.');

      console.log(commands)
      await rest.put(
        Routes.applicationGuildCommands(CLIENTID, GUILDID),
        { body: commands.data },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error)
      console.error(error.rawError.errors[1]);
    }
  })();
  // } else if (process.env.NODE_ENV === 'prod') {
  //   (async () => {
  //     try {
  //       console.log('[PROD] Started refreshing application (/) commands.');

  //       console.log(commands)
  //       await rest.put(
  //         Routes.applicationCommands(CLIENTID),
  //         { body: commands.data },
  //       );

  //       console.log('Successfully reloaded application (/) commands.');
  //     } catch (error) {
  //       console.error(error)
  //       console.error(error.rawError.errors[1]);
  //     }
  //   })();
}