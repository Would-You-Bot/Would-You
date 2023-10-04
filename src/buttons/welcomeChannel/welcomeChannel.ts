import {
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "welcomeChannel",
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("seletcMenuWelcome")
          .setPlaceholder("Select a channel")
          .addChannelTypes(ChannelType.GuildText),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.dailyChannel",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
