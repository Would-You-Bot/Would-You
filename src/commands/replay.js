const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const guildModel = require('../util/Models/guildModel');
require("dotenv").config();
const Topgg = require(`@top-gg/sdk`)
const api = new Topgg.Api(process.env.TOPGGTOKEN)

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Edit the replay system.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Bearbeite das Replay System.',
            "es-ES": 'Editar el sistema de repetición.'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('toggle')
            .setDescription('Enable/disable the replay button')
            .addBooleanOption((option) =>
                option
                    .setName('enable')
                    .setDescription('Disable or enable the replay button.')
                    .setRequired(true)
            )),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const { REPLAY } = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getSubcommand()) {
                case "toggle":
                    const toggle = interaction.options.getBoolean('enable');

                    if (toggle === guildDb.replay) {
                        const alreadyEmbed = new EmbedBuilder()
                            .setColor("#2f3037")
                            .setTitle("Error!")
                            .setDescription(
                                guildDb.replay
                                    ? REPLAY.embed.errorAlready2
                                    : REPLAY.embed.errorAlready
                            );

                        return interaction
                            .reply({
                                embeds: [alreadyEmbed],
                                ephemeral: true,
                            })
                            .catch((err) => {
                                return;
                            });
                    }

                    await client.database.updateGuild(interaction.guildId, {
                        replay: toggle,
                    }, true);

                    const doneEmbed = new EmbedBuilder()
                        .setColor("#2f3037")
                        .setTitle(REPLAY.embed.title)
                        .setDescription(
                            !guildDb.replay
                                ? `${REPLAY.embed.description} **${interaction.options.getBoolean('enable')}**`
                                : REPLAY.embed.success
                        );
                    await interaction
                        .reply({
                            embeds: [doneEmbed],
                            ephemeral: true,
                        })
                        .catch((err) => {
                            return;
                        });
                    break;
            }
        } else {
            const errorembed = new EmbedBuilder()
                .setColor("#F00505")
                .setTitle("Error!")
                .setDescription(REPLAY.embed.missingPerms);

            return interaction
                .reply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
                .catch((err) => {
                    return;
                });
        }
    },
};
