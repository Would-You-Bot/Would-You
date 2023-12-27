import { EmbedBuilder, CommandInteraction } from "discord.js";
import WouldYou from "../../../wouldYou";
import { IGuildModel } from "../../../Models/guildModel";

export class HigherLowerEmbed extends EmbedBuilder {
  constructor(
    interaction: CommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ) {
    super();

    this.setColor("#0598F6");
    this.setTitle(
      client.translation.get(guildDb?.language, "HigherLower.initial.title"),
    );
    this.setDescription(
      client.translation.get(
        guildDb?.language,
        "HigherLower.initial.description",
      ),
    ).setFooter({
      text: "Requested by " + interaction.user.username,
      iconURL: interaction.user.displayAvatarURL() || undefined,
    });
  }
}
