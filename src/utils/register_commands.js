const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const discord = require('discord.js');
const fs = require('fs');

const commands = [];

module.exports = (client, token) => {
  client.commands = new discord.Collection();
  const commandFiles = fs.readdirSync('./src/commands')
      .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const rest = new REST({version: '9'}).setToken(token);

  rest.put(Routes.applicationCommands(client.application.id), {body: commands})
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);

  return client;
};
