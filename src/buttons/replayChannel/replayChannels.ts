import {
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "replayChannels",
  execute: async (interaction, client, guildDb) => {
    if (guildDb.replayChannels.length >= 15) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelLimit",
        ),
        ephemeral: true,
      });
      return;
    }

    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("selectMenuReplay")
          .setPlaceholder("Select a channel")
          .addChannelTypes(ChannelType.GuildText),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.replayChannel",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
