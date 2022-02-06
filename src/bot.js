const discord = require('discord.js');
const {Worker} = require('worker_threads');
const botConfig = require('../config/bot.json');
const registerCommands = require('./utils/register_commands.js');
require('./utils/db.js');
require('./utils/db_migrations.js');
const rssReader = require('./utils/rss_reader.js');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', format: winston.format.json(), transports: [//
    new winston.transports.File({
      filename: 'error.log', level: 'error',
    }), new winston.transports.File({filename: 'combined.log'})],
});

const errorHelper = {
  error: logger.error.bind(logger),
};

let fetchFeedWorker = 0;

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
  fetchFeedWorker = new Worker('./src/workers/rss_feed_worker.js');
  rssReader.reload();
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
    db.guild.create({
      guild_id: currentGuild.id,
      guild_name: currentGuild.name,
      bot_admin_role: currentGuild.roles.highest.id,
      bot_config_channel: result.id,
      bot_feed_channel: result.id,
    }).then(async (savedGuild) => {
      await currentGuild.channels.create('bot-feed', {
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
        savedGuild.bot_feed_channel = result.id;
        savedGuild.save();
      });
    });
  });
});

client.on('guildDelete', (currentGuild) => {
  db.guild.findByPk(currentGuild.id).then(async (retrievedGuild) => {
    if (retrievedGuild.bot_config_channel) {
      await currentGuild.channels.cache.get(
          retrievedGuild.bot_config_channel,
      ).delete();
    }
  }).then(
      db.guild.destroy({
        where: {
          guild_id: currentGuild.id,
        },
      }),
  );
});

process.on('uncaughtException', function(err) {
  console.error(err);
});

rssReader.feeder.on('new-item', async function(item) {
  try {
    const timestamp = item.pubdate;
    const link = item.link;
    const title = item.title;
    const author = item.author;
    const summary = item.summary;
    const description = item.description;
    const feedLink = item.meta.link;
    let textSummary = '';
    try {
      textSummary = summary.replace(/<[^>]*>/g, '').replace('\n', ' ');
    } catch (err) {
      try {
        textSummary = description.replace(/<[^>]*>/g, '').replace('\n', ' ');
      } catch (err2) {
        if (summary) {
          textSummary = summary.replace('\n', ' ');
        } else if (description) {
          textSummary = description.replace('\n', ' ');
        }
      }
    }
    console.log(itemObject.meta.guid);
    const itemObject = {timestamp, link, title, author, textSummary, feedLink};
    fetchFeedWorker.postMessage({data: itemObject, db: db});
    fetchFeedWorker.on('message', (result) => {
      console.log(`${result.data}`);
    });
  } catch (err) {
    errorHelper.error(`[!] ERR: ${err}`);
  }
});

rssReader.feeder.on('error', errorHelper.error);

client.login(botConfig.botToken);
global.botConfig = botConfig;
