const {SlashCommandBuilder} = require('@discordjs/builders');
const Guild = require('../models/guild.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Gives some useful insights!'),
  async execute(interaction) {
    Guild.findByPk(interaction.guildId).then((guild) => {
      if (!guild) {
        return interaction.reply(
            'Please re-invite the bot so the database can sync!',
        );
      }
      const role = interaction.guild.roles.cache.get(guild.bot_admin_role);
      return interaction.reply(`Admin Role: ${role.name}`);
    });
  },
};
