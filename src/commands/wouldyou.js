const {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder, PermissionFlagsBits,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('wouldyou')
        .setDescription('Gives you a would you question')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Gibt dir eine would you Frage',
            "es-ES": 'Te hace una pregunta Would You'
        })
        .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Useless Power')
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?')))
        .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Useful Power')
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?'))),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        var power;
        let wouldyouembed;
        const {WouldYou, Rather} = await require(`../languages/${guildDb.language}.json`);
        const {Useless_Powers, Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands'),
        );
        let voting;
        if (interaction.options.getBoolean('voting') == false) voting = false;
        else voting = true;
        const newbutton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId(voting ? `wouldyou_${interaction.options.getSubcommand()}_voting` : `wouldyou_${interaction.options.getSubcommand()}`),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newbutton];
        } else {
            rbutton = [newbutton];
        }
        switch (interaction.options.getSubcommand()) {
            case 'useful':
                if (guildDb.customTypes === "regular") {
                    power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                } else if (guildDb.customTypes === "mixed") {
                    let array = [];
                    if (guildDb.customMessages.filter(c => c.type === "useful") != 0) {
                        array.push(guildDb.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useful").length)].msg || Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                    } else {
                        power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                    }
                    array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                    power = array[Math.floor(Math.random() * array.length)]
                    array = [];
                } else if (guildDb.customTypes === "custom") {
                    if (guildDb.customMessages.filter(c => c.type === "useful") == 0) return await interaction.reply({
                        ephemeral: true,
                        content: `${Rather.button.nocustom}`
                    })
                    power = guildDb.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useful").length)].msg;
                }

                wouldyouembed = new EmbedBuilder()
                    .setColor('#0598F6')
                    .setFooter({
                        text: `${WouldYou.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp()
                    .addFields({
                        name: WouldYou.embed.Usefulname,
                        value: `> ${power}`,
                        inline: false,
                    });
                break;
            case 'useless':
                if (guildDb.customTypes === "regular") {
                    power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                } else if (guildDb.customTypes === "mixed") {
                    let array = [];
                    if (guildDb.customMessages.filter(c => c.type === "useless") != 0) {
                        array.push(guildDb.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useless").length)].msg || Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                    } else {
                        power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
                    }
                    array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                    power = array[Math.floor(Math.random() * array.length)]
                    array = [];
                } else if (guildDb.customTypes === "custom") {
                    if (guildDb.customMessages.filter(c => c.type === "useless") == 0) return await interaction.reply({
                        ephemeral: true,
                        content: `${Rather.button.nocustom}`
                    })
                    power = guildDb.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useless").length)].msg;
                }

                wouldyouembed = new EmbedBuilder()
                    .setColor('#F00505')
                    .setFooter({
                        text: `${WouldYou.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp()
                    .addFields({
                        name: WouldYou.embed.Uselessname,
                        value: `> ${power}`,
                        inline: false,
                    });
                break;
        }
        const message = await interaction.reply({
            embeds: [wouldyouembed],
            fetchReply: true,
            components: guildDb.replay ? rbutton : [] || [],
        }).catch((err) => {
            return;
        });
        if (interaction.options.getBoolean('voting') == false) {
        } else {
            try {
                if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                    PermissionFlagsBits.AddReactions,
                ])) {
                    await message.react('✅');
                    await message.react('❌');
                }

                const filter = (reaction) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌';

                const collector = message.createReactionCollector({
                    filter,
                    time: 20000,
                });

                collector.on('end', async () => {
                    const msg = await message.fetch().catch((err) => {
                    });

                    if (msg) {
                        const checksCount = msg.reactions.cache.get('✅')?.count ?? 0;
                        const crossCount = msg.reactions.cache.get('❌')?.count ?? 0;

                        const totalreactions = checksCount
                            - 1
                            + crossCount
                            - 1;
                        let percentage = Math.round(
                            ((checksCount - 1)
                                / totalreactions)
                            * 100,
                        );
                        let emoji = null;
                        let color = null;
                        const userstotal = totalreactions < 2
                            ? `${WouldYou.stats.user}`
                            : `${WouldYou.stats.users}`;

                        if (
                            checksCount
                            - 1
                            + crossCount
                            - 1
                            == 0
                        ) {
                            percentage = 0;
                            emoji = '🤷';
                            color = '#F0F0F0';
                        }

                        if (percentage > 50) {
                            color = '#0598F6';
                            emoji = '✅';
                        } else if (percentage < 50) {
                            color = '#F00505';
                            emoji = '❌';
                        } else {
                            color = '#F0F0F0';
                            emoji = '🤷';
                        }

                        wouldyouembed = new EmbedBuilder()
                            .setColor(color)
                            .setFooter({text: `${WouldYou.embed.footer}`, iconURL: client.user.avatarURL()})
                            .setTimestamp()
                            .addFields(
                                {
                                    name: WouldYou.embed.Uselessname,
                                    value: `> ${power}`,
                                    inline: false,
                                },
                                {
                                    name: 'Stats',
                                    value: `> **${percentage}%** ${WouldYou.stats.of} **${totalreactions} ${userstotal}** ${WouldYou.stats.taking} ${emoji}`,
                                },
                            );

                        collector.stop();

                        try {
                            if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBits.ManageMessages])) await msg.reactions.removeAll();
                        } catch (error) {
                        }

                        return interaction.editReply({
                            embeds: [wouldyouembed],
                            components: guildDb.replay ? rbutton : [] || [],
                        }).catch((err) => {
                            return;
                        });
                    }
                });
            } catch (error) {
            }
        }
    },
};
