import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
} from "discord.js";

import { Button } from "../../interfaces";

import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getQuestionsByType } from "../../util/Functions/jsonImport";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "wwyd",
  cooldown: true,
  execute: async (interaction: any, client, guildDb) => {
    await interaction.deferUpdate();
    await interaction.editReply({
      components: [],
    });
    if (interaction.guild) {
      if (interaction.channel.isThread()) {
        if (
          !interaction.channel
            ?.permissionsFor(interaction.user.id)
            .has(PermissionFlagsBits.SendMessagesInThreads)
        ) {
          return interaction.followUp({
            content:
              "You don't have permission to use this button in this channel!",
            ephemeral: true,
          });
        }
      } else {
        if (
          !interaction.channel
            ?.permissionsFor(interaction.user.id)
            .has(PermissionFlagsBits.SendMessages)
        ) {
          return interaction.followUp({
            content:
              "You don't have permission to use this button in this channel!",
            ephemeral: true,
          });
        }
      }
    }

    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    let WWYD = await getQuestionsByType(
      "whatwouldyoudo",
      guildDb,
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    const wwydEmbed = new DefaultGameEmbed(
      interaction,
      WWYD.id,
      WWYD.question,
      "wwyd",
    );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false)
        .setCustomId(`wwyd`),
    ]);

    const classicData: InteractionReplyOptions = guildDb?.classicMode
      ? { content: WWYD.question, fetchReply: true }
      : { embeds: [wwydEmbed], components: [row] };

    interaction.followUp(classicData).catch((err: Error) => {
      captureException(err);
    });
    return;
  },
};

export default button;
