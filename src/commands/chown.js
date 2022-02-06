const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('chown')
      .setDescription('Permissions management tool')
      .addRoleOption(
          (option) => option.setName('admin')
              .setDescription('Select the new admin role!'),
      ),
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
      const newAdminRole = interaction.options.getRole('admin');
      if (!newAdminRole) {
        return interaction.reply('You need to mention a new admin role!');
      }
      if (interaction.member.roles.resolveId(adminRole.id)) {
        db.guild.update({
          bot_admin_role: newAdminRole.id,
        }, {
          where: {
            guild_id: interaction.guildId,
          },
        });
        return interaction.reply(
            `New admin is: ${newAdminRole}`+
          `please update the config channel accordingly!`,
        );
      } else {
        return interaction.reply(
            `Sorry, it doesn't seem like you are allowed to do that!`,
        );
      }
    });
  },
};
