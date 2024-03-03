import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";
const { version } = require("../../../package.json");

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about the bot.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Zeigt einige Informationen über den Bot.",
      "es-ES": "Muestra información sobre el bot.",
      fr: "Affiche des informations sur le bot",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const serverCount = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size,
    );

    const userCount = await client.cluster.broadcastEval((c) =>
      c.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    );

    const unixstamp =
      Math.floor(Date.now() / 1000) - Math.floor((client.uptime || 0) / 1000);

    function round(num: number) {
      const m = Number((Math.abs(num) * 100).toPrecision(15));
      return (Math.round(m) / 100) * Math.sign(num);
    }

    const infoEmbed = new EmbedBuilder()
      .setColor("#5865f4")
      .setTitle("Bot Info")
      .addFields(
        {
          name: "Developers 🐧",
          value:
            "```@dominikdev\n@forgetfulskybro\n@536b656c6c79\n@sans._.\n@gersti```",
          inline: false,
        },
        {
          name: "Guilds 🏢",
          value: `\`\`\`${serverCount.reduce((prev, val) => prev + val, 0)}\`\`\``,
          inline: true,
        },
        {
          name: "Users 🐧",
          value: `\`\`\`${userCount.reduce((a, b) => a + b, 0).toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: "Memory 🎇",
          value: `\`\`\`${round(
            process.memoryUsage().heapUsed / 1000000000,
          )}GB\n\`\`\``,
          inline: true,
        },
        {
          name: "Last Restart 🚀",
          value: `
          <t:${unixstamp}:R>`,
          inline: true,
        },
        {
          name: "Bot Version 🧾",
          value: `\`\`\`v${version}\`\`\``,
          inline: true,
        },
      )
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setFooter({
        text:
          interaction.user.tag +
          " |" +
          " Shard #" +
          interaction?.guild?.shardId +
          " |" +
          " Cluster #" +
          client.cluster.id,
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    interaction
      .reply({ embeds: [infoEmbed], ephemeral: false })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
