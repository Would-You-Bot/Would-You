import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("A list of every command")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Eine Liste aller Befehle",
      "es-ES": "Una lista de todos los comandos",
      fr: "Une liste de chaque commande",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const languageMappings = {
      de_DE: "de",
      en_EN: "en",
      es_ES: "es",
      fr_FR: "fr",
    } as any;

    const commands = await client.application?.commands.fetch({
      withLocalizations: true,
    });
    const type = languageMappings[guildDb?.language] || "en";
    const helpembed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setDescription(
        `## Hello \n\n **Would You** is a bot that allows you to play the game 'Would You Rather' with your friends on Discord. \n\n## Main Game Modes \n\n </wouldyourather:1099463656124723305> \n\n## Privacy \n\n If you dont want to show up on leaderboards or votes. You can adjust your privacy settings using </privacy:1162855843658735716>. To find out what data we store visit our [Privacy Policy](https://wouldyoubot.gg/privacy)`,
      );

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Would You Support")
          .setStyle(5)
          .setEmoji("💫")
          .setURL("https://discord.gg/vMyXAxEznS"),
        new ButtonBuilder()
          .setLabel("Would You Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
        new ButtonBuilder()
          .setLabel("View Commands")
          .setCustomId("viewCommands")
          .setStyle(2)
          .setEmoji("➡️"),
      );
    await interaction
      .reply({
        content: "discord.gg/vMyXAxEznS",
        embeds: [helpembed],
        components: [button],
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
