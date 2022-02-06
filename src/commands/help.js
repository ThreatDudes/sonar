const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Gives some useful insights!'),
  async execute(interaction) {
    db.guild.findByPk(interaction.guildId).then((guild) => {
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
