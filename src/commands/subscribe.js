const {SlashCommandBuilder} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
      .setName('subscribe')
      .setDescription('Subscribe to a feed')
      .addStringOption((option) => option.setName('url')
          .setDescription('Feed URL'))
      .addStringOption((option) => option.setName('category')
          .setDescription('Feed Category'))
      .addStringOption((option) => option.setName('name')
          .setDescription('Feed Name'))
      .addStringOption((option) => option.setName('description')
          .setDescription('Feed Description'))
      .addStringOption((option) => option.setName('protocol')
          .setDescription('protocol')),
  async execute(interaction) {
    db.guild.findByPk(interaction.guildId).then(async (currentGuild) => {
      if (!currentGuild) {
        return interaction.reply(
            'Please re-invite the bot so the database can sync!',
        );
      }
      const adminRole = interaction.guild.roles.cache.get(
          currentGuild.bot_admin_role,
      );
      const feed = {
        feed_name: interaction.options.getString('name'),
        category: interaction.options.getString('category').toLowerCase(),
        url: interaction.options.getString('url'),
        description: interaction.options.getString('description'),
        protocol: interaction.options.getString('protocol'),
      };
      if (interaction.member.roles.resolveId(adminRole.id)) {
        const pattern = new RegExp('^(https?|ftp)://');
        if (!pattern.test(feed.url)) {
          feed.url = 'http://' + feed.url;
        }
        db.feed.create({url: feed.url}).then((savedFeed) => {
          db.category.findOne(
              {
                where: {
                  name: feed.category,
                },
              },
          ).then((savedCategory) => {
            db.protocol.findOne(
                {
                  where: {
                    name: feed.protocol,
                  },
                },
            ).then((savedProtocol) => {
              savedFeed.setCategories(savedCategory.category_id);
              savedFeed.setGuilds(interaction.guildId);
              savedFeed.setProtocols(savedProtocol.protocol_id);
              savedFeed.feed_name = feed.feed_name;
              savedFeed.description = feed.description;
              savedFeed.rating = 0;
              savedFeed.active = true;
              savedFeed.save();
              interaction.reply(`You are subscribed to ${feed.feed_name} now!`);
            });
          });
        },
        );
      } else {
        return interaction.reply(
            `Sorry, it doesn't seem like you are allowed to do that!`,
        );
      }
    });
  },
};
