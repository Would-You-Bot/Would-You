import {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import axios from "axios";
import Paginator from "../../util/pagination";
import "dotenv/config";
import { ChatInputCommand } from "../../models";

function makeID(length: number) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("custom")
    .setDescription("Adds custom WouldYou messages.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Fügt eigene WouldYou Fragen hinzu.",
      "es-ES": "Añade mensajes Would You personalizados.",
      fr: "Ajoute des messages personnalisés au bot",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a custom message")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription(
              "Select which category you want this custom message to be in.",
            )
            .setRequired(true)
            .addChoices(
              { name: "Would You Rather", value: "wouldyourather" },
              { name: "Never Have I Ever", value: "neverhaveiever" },
              { name: "What Would You Do", value: "wwyd" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "Input a message to create a custom WouldYou message.",
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a custom message.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Input a custom WouldYou ID number to remove it.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removeall")
        .setDescription("Removes all custom messages."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("Views all of your custom WouldYou messages"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("import")
        .setDescription("Imports custom messages from a JSON file.")
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription(
              "Import a JSON file containing useless or useful Would You custom messages.",
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("export")
        .setDescription("Exports custom messages into a JSON file."),
    ),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    var typeEmbed = new EmbedBuilder();
    var message: string | null;
    if (
      (interaction?.member?.permissions as Readonly<PermissionsBitField>).has(
        PermissionFlagsBits.ManageGuild,
      ) ||
      global.checkDebug(guildDb, interaction?.user?.id)
    ) {
      switch (interaction.options.getSubcommand()) {
        case "add":
          if (!client.voteLogger.votes.has(interaction.user.id)) {
            if (guildDb.customMessages.length >= 30)
              interaction.reply({
                ephemeral: true,
                content: client.translation.get(
                  guildDb?.language,
                  "wyCustom.error.maximum",
                ),
              });
            return;
          }

          const option =
            interaction?.options?.getString("options")?.toLowerCase() || "";
          message = interaction.options.getString("message");

          let newID = makeID(6);
          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.title",
              ),
            )
            .setColor("#0598F4")
            .setDescription(
              `**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descID",
              )}**: ${newID}\n**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descCat",
              )}**: ${option}\n\n**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descCont",
              )}**: \`${message}\``,
            )
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });

          guildDb.customMessages.push({
            id: newID,
            msg: message || "",
            type: option,
          });

          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customMessages: guildDb.customMessages,
            },
            true,
          );
          break;
        case "remove":
          message = interaction.options.getString("message");

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemove.title",
              ),
            )
            .setColor("#0598F4")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });

          if (
            !guildDb.customMessages.find((c) => c.id.toString() === message)
          ) {
            interaction.reply({
              ephemeral: true,
              content: "There is no custom WouldYou message with that ID!",
            });
            return;
          }
          let filtered = guildDb.customMessages.filter(
            (c) => c.id.toString() != message,
          );

          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customMessages: filtered,
            },
            true,
          );
          break;
        case "removeall":
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemoveAll.none",
              ),
              ephemeral: true,
            });
            return;
          }

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemoveAll.title",
              ),
            )
            .setColor("#0598F4")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });

          const button =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Accept")
                .setStyle(4)
                .setCustomId("wycustom_accept"),
              new ButtonBuilder()
                .setLabel("Decline")
                .setStyle(2)
                .setCustomId("wycustom_decline"),
            );

          interaction.reply({
            embeds: [typeEmbed],
            components: [button],
            ephemeral: true,
          });
          break;
        case "view":
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.empty",
              ),
            });
            return;
          }

          if (client.paginate.get(interaction.user.id)) {
            interaction.reply({
              content: `${client.translation.get(
                guildDb?.language,
                "wyCustom.error.paginate",
              )} [Link](https://canary.discord.com/channels/${interaction.guild
                ?.id}/${client.paginate.get(interaction.user.id).channel}/${
                client.paginate.get(interaction.user.id).message
              })`,
              ephemeral: true,
            });
            return;
          }

          const page = new Paginator({
            user: interaction.user.id,
            timeout: 180000,
            client,
          });

          if (
            guildDb.customMessages.filter((c) => c.type === "neverhaveiever")
              .length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "neverhaveiever")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID",
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg",
                  )}: ${s.msg}`,
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5),
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title",
                    ),
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatNHIE",
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`,
                  )
                  .setColor("#0795F6"),
              ),
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "wouldyourather")
              .length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "wouldyourather")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID",
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg",
                  )}: ${s.msg}`,
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5),
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title",
                    ),
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatWYR",
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`,
                  )
                  .setColor("#0795F6"),
              ),
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "wwyd").length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "wwyd")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID",
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg",
                  )}: ${s.msg}`,
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5),
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title",
                    ),
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatWWYD",
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`,
                  )
                  .setColor("#0795F6"),
              ),
            );
          }
          page.start(interaction);
          return;
        case "import":
          const attachemnt = interaction.options.get("attachment");

          if (!attachemnt) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.import.att1",
              ),
            });
            return;
          }
          if (!attachemnt.attachment?.name.includes(".json")) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.import.att2",
              ),
            });
            return;
          }

          // Let give the bot some more time to fetch it :)
          await interaction.deferReply({ ephemeral: true });

          axios
            .get(attachemnt.attachment.url, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(async (response) => {
              if (response.data.length === 0) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att3",
                  ),
                });
                return;
              }
              if (
                !response.data.wouldyourather &&
                !response.data.neverhaveiever &&
                !response.data.wwyd
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att4",
                  ),
                });
                return;
              }
              if (
                !(response.data.wouldyourather.length === 0) &&
                !(response.data.neverhaveiever === 0) &&
                !response.data.wwyd
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att5",
                  ),
                });
                return;
              }
              if (
                response.data.wouldyourather &&
                response.data.wouldyourather.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att16",
                  ),
                });
                return;
              }
              if (
                response.data.neverhaveiever &&
                response.data.neverhaveiever.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att17",
                  ),
                });
                return;
              }

              if (
                response.data.wwyd &&
                response.data.wwyd.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att18",
                  ),
                });
                return;
              }

              let wouldyourather = guildDb.customMessages.filter(
                (c) => c.type === "wouldyourather",
              ).length;
              let neverhaveiever = guildDb.customMessages.filter(
                (c) => c.type === "neverhaveiever",
              ).length;
              let wwyd = guildDb.customMessages.filter(
                (c) => c.type === "wwyd",
              ).length;

              if (
                wouldyourather > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att19",
                  ),
                });
                return;
              }

              if (
                neverhaveiever > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att20",
                  ),
                });
                return;
              }
              if (
                wwyd > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att21",
                  ),
                });
                return;
              }

              if (response.data.wouldyourather) {
                if (
                  response.data.wouldyourather.length + wouldyourather > 30 &&
                  !client.voteLogger.votes.has(interaction.user.id)
                ) {
                  interaction.editReply({
                    options: {
                      ephemeral: true,
                    },
                    content: client.translation.get(
                      guildDb?.language,
                      "wyCustom.error.import.att22",
                    ),
                  });
                  return;
                }
                response.data.wouldyourather.map((d: any) => {
                  let newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg: d,
                    type: "wouldyourather",
                  });
                });
              }

              if (response.data.neverhaveiever) {
                if (
                  response.data.neverhaveiever.length + neverhaveiever > 30 &&
                  !client.voteLogger.votes.has(interaction.user.id)
                ) {
                  interaction.editReply({
                    options: {
                      ephemeral: true,
                    },
                    content: client.translation.get(
                      guildDb?.language,
                      "wyCustom.error.import.att23",
                    ),
                  });
                  return;
                }

                response.data.neverhaveiever.map((d: any) => {
                  let newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg: d,
                    type: "neverhaveiever",
                  });
                });
              }

              if (response.data.wwyd) {
                if (
                  response.data.wwyd.length + wwyd > 30 &&
                  !client.voteLogger.votes.has(interaction.user.id)
                ) {
                  interaction.editReply({
                    options: {
                      ephemeral: true,
                    },
                    content: client.translation.get(
                      guildDb?.language,
                      "wyCustom.error.import.att24",
                    ),
                  });
                  return;
                }

                response.data.wwyd.map((d: any) => {
                  let newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg: d,
                    type: "wwyd",
                  });
                });
              }

              await client.database.updateGuild(
                interaction.guildId || "",
                {
                  ...guildDb,
                  customMessages: guildDb.customMessages,
                },
                true,
              );

              interaction.editReply({
                options: {
                  ephemeral: true,
                },
                content: client.translation.get(
                  guildDb?.language,
                  "wyCustom.success.import",
                ),
              });
              return;
            })
            .catch((err) => {
              captureException(err);
              interaction.editReply(
                `${client.translation.get(
                  guildDb?.language,
                  "wyCustom.error.import.att15",
                )}\n\nError: ${err}`,
              );
              return;
            });
          break;
        case "export":
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.export.none",
              ),
            });
            return;
          }

          await interaction.deferReply();

          let wouldyourather = guildDb.customMessages.filter(
            (c) => c.type === "wouldyourather",
          );
          let neverhaveiever = guildDb.customMessages.filter(
            (c) => c.type === "neverhaveiever",
          );
          let wwyd = guildDb.customMessages.filter((c) => c.type === "wwyd");

          let text = "{\n";
          let arrays = [];

          if (wouldyourather.length > 0) {
            let arrayText = `"wouldyourather": [`;
            wouldyourather.map((a, i) => {
              i = i++ + 1;
              arrayText += `\n"${a.msg}"${
                wouldyourather.length !== i ? "," : ""
              }`;
            });
            arrayText += `\n]`;
            arrays.push(arrayText);
          }

          if (neverhaveiever.length > 0) {
            let arrayText = `"neverhaveiever": [`;
            neverhaveiever.map((a, i) => {
              i = i++ + 1;
              arrayText += `\n"${a.msg}"${
                neverhaveiever.length !== i ? "," : ""
              }`;
            });
            arrayText += `\n]`;
            arrays.push(arrayText);
          }

          if (wwyd.length > 0) {
            let arrayText = `"wwyd": [`;
            wwyd.map((a, i) => {
              i = i++ + 1;
              arrayText += `\n"${a.msg}"${wwyd.length !== i ? "," : ""}`;
            });
            arrayText += `\n]`;
            arrays.push(arrayText);
          }

          text += arrays.join(",\n");
          text += "\n}";

          interaction.editReply({
            content: client.translation.get(
              guildDb?.language,
              "wyCustom.success.export",
            ),
            files: [
              {
                attachment: Buffer.from(text),
                name: `Custom_Messages_${interaction.guild?.id}.json`,
              },
            ],
          });
          return;
      }

      interaction
        .reply({
          embeds: [typeEmbed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
      return;
    } else {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Language.embed.error"),
        );
      interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
      return;
    }
  },
};

export default command;
