const discord = require('discord.js');
const botConfig = require('../config/bot.json');
const registerCommands = require('./utils/register_commands.js');
require('./utils/db.js');
require('./utils/db_migrations.js');
const Guild = require('./models/guild.js');

// Create client with read and write intent only
const client = new discord.Client({
  intents: [
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.GuildWebhooks,
  ],
});

client.on('ready', async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  registerCommands(client, botConfig.botToken);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply(
        {
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
  }
});

client.on('guildCreate', async (currentGuild) => {
  await currentGuild.channels.create(
      'bot-settings', {
        type: 0,
        permissionOverwrites: [
          {
            id: currentGuild.id,
            deny: [discord.PermissionFlagsBits.ViewChannel],
          },
          {
            id: currentGuild.roles.highest.id,
            allow: [discord.PermissionFlagsBits.ViewChannel],
          },
        ],
      }).then((result) => {
    Guild.create({
      guild_id: currentGuild.id,
      guild_name: currentGuild.name,
      bot_admin_role: currentGuild.roles.highest.id,
      bot_config_channel: result.id,
    });
  });
});

client.on('guildDelete', (currentGuild) => {
  Guild.findByPk(currentGuild.id).then((retrievedGuild) => {
    currentGuild.channels.cache.get(retrievedGuild.bot_config_channel).delete();
  });
  Guild.destroy({
    where: {
      guild_id: currentGuild.id,
    },
  });
});

client.login(botConfig.botToken);
global.botConfig = botConfig;
