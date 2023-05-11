const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "welcomePing",
    description: "Welcome User Pings",
  },
  async execute(interaction, client, guildDb) {
    const check = guildDb.welcomePing;

    const welcomes = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb?.language, 'Settings.embed.welcomeTitle'))
      .setDescription(
        `${client.translation.get(guildDb?.language, 'Settings.embed.welcome')}: ${
          guildDb.welcome
            ? `<:check:1077962440815411241>`
            : `<:x_:1077962443013238814>`
        }\n${client.translation.get(guildDb?.language, 'Settings.embed.welcomePing')}: ${
          check ? `<:x_:1077962443013238814>` : `<:check:1077962440815411241>`
        }\n${client.translation.get(guildDb?.language, 'Settings.embed.welcomeChannel')}: ${
          guildDb.welcomeChannel
            ? `<#${guildDb.welcomeChannel}>`
            : `<:x_:1077962443013238814>`
        }`
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, 'Settings.embed.footer'),
        iconURL: client.user.avatarURL(),
      });

    const welcomeButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("welcome")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcome'))
          .setStyle(guildDb.welcome ? "Success" : "Secondary"),
        new ButtonBuilder()
          .setCustomId("welcomeChannel")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcomeChannel'))
          .setStyle(guildDb.welcomeChannel ? "Success" : "Secondary")
      ),
      welcomeButtons2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomePing")
          .setLabel(client.translation.get(guildDb?.language, 'Settings.button.welcomePing'))
          .setStyle(check ? "Secondary" : "Success")
      );

    await client.database.updateGuild(interaction.guild.id, {
      welcomePing: !check,
    });

    return interaction.update({
      content: null,
      embeds: [welcomes],
      components: [welcomeButtons, welcomeButtons2],
      ephemeral: true,
    });
  },
};
