const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "selectMenuChannel",
    description: "Select Menu Channel",
  },
  async execute(interaction, client, guildDb) {
    const newChannel = interaction.values[0];
    const dailyMsgs = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb?.language, 'Settings.embed.dailyTitle'))
      .setDescription(
        `${client.translation.get(guildDb?.language, 'Settings.embed.dailyMsg')}: ${
          guildDb.dailyMsg
            ? `<:check:1077962440815411241>`
            : `<:x_:1077962443013238814>`
        }\n${client.translation.get(guildDb?.language, 'Settings.embed.dailyChannel')}: <#${newChannel}>\n${
            client.translation.get(guildDb?.language, 'Settings.embed.dailyRole')
        }: ${
          guildDb.dailyRole
            ? `<@&${guildDb.dailyRole}>`
            : `<:x_:1077962443013238814>`
        }\n${client.translation.get(guildDb?.language, 'Settings.embed.dailyTimezone')}: ${guildDb.dailyTimezone}\n${
            client.translation.get(guildDb?.language, 'Settings.embed.dailyInterval')
        }: ${guildDb.dailyInterval}\n${client.translation.get(guildDb?.language, 'Settings.embed.dailyType')}: ${
          guildDb.customTypes
        }`
      )
      .setColor("#0598F6");

    const dailyButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyMsg")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyMsg'))
          .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
        new ButtonBuilder()
          .setCustomId("dailyChannel")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyChannel'))
          .setStyle("Success"),
        new ButtonBuilder()
          .setCustomId("dailyType")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyType'))
          .setStyle("Primary")
          .setEmoji("📝")
      ),
      dailyButtons2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyTimezone")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyTimezone'))
          .setStyle("Primary")
          .setEmoji("🌍"),
        new ButtonBuilder()
          .setCustomId("dailyRole")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyRole'))
          .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
        new ButtonBuilder()
          .setCustomId("dailyInterval")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.dailyInterval'))
          .setStyle("Primary")
          .setEmoji("⏰")
      );

    await client.database.updateGuild(interaction.guild.id, {
      dailyChannel: newChannel,
    });

    return interaction.update({
      content: null,
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2],
      ephemeral: true,
    });
  },
};
