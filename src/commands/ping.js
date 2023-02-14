const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the clients ping')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Zeigt den Ping des Clients an',
            "es-ES": 'Muestra el ping del cliente'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const {Ping} = require(`../languages/${guildDb.language}.json`);

        const pingembed = new EmbedBuilder()

            .setColor('#0598F6')
            .setFooter({
                text: `${Ping.embed.footer}`,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(Ping.embed.title)
            .addFields(
                {
                    name: Ping.embed.client,
                    value: `> **${Math.abs(
                        Date.now() - interaction.createdTimestamp,
                    )}**ms`,
                    inline: false,
                },
                {
                    name: Ping.embed.api,
                    value: `> **${Math.round(client.ws.ping)}**ms`,
                    inline: false,
                },
            );
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(Ping.button.title)
                .setStyle(5)
                .setEmoji('💻')
                .setURL('https://discordstatus.com/'),
        );
        await interaction.reply({
            embeds: [pingembed],
            components: [button],
        }).catch((err) => {
            return;
        });
        setTimeout(() => {
            button.components[0].setDisabled(true);
            interaction.editReply({
                embeds: [pingembed],
                components: [button],
            }).catch((err) => {
                return;
            });
        }, 120000);
    },
};
