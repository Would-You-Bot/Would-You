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
        .setName('help')
        .setDescription('Help command!')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: "Hilfe Befehl!",
            "es-ES": 'Comando de ayuda!'
        }),
    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const commands = await client.application.commands.fetch({withLocalizations: true})
        let type;
        if (guildDb.language === "de_DE") {
            type = "de"
        } else if (guildDb.language === "en_EN") {
            type = "en"
        } else if (guildDb.language === "es_ES") {
            type = "es"
        }
        const helpembed = new EmbedBuilder()
            .setColor('#0598F6')
            .setFooter({
                text: client.translation.get(guildDb?.language, 'Help.embed.footer'),
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(client.translation.get(guildDb?.language, 'Help.embed.title'))
            .addFields(
                {
                    name: client.translation.get(guildDb?.language, 'Help.embed.Fields.privacyname'),
                    value: client.translation.get(guildDb?.language, 'Help.embed.Fields.privacy'),
                    inline: false,
                },
            )
            .setDescription(client.translation.get(guildDb?.language, 'Help.embed.description') + `\n\n${commands.filter(e => e.name !== "reload").sort((a, b) => a.name.localeCompare(b.name)).map(n => `</${n.name}:${n.id}> - ${type === "de" ? n.descriptionLocalizations.de : type === "es" ? n.descriptionLocalizations["es-ES"] : n.description}`).join("\n")}`);

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(client.translation.get(guildDb?.language, 'Help.button.title'))
                .setStyle(5)
                .setEmoji('💫')
                .setURL('https://discord.gg/vMyXAxEznS'),
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('1009964111045607525')
                .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands'),
        );
        await interaction.reply({
            embeds: [helpembed],
            components: [button],
        }).catch((err) => {
            return;
        });
    },
};
