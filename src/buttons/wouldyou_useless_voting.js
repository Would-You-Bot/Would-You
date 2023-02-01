const {ButtonBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: {
        name: 'wouldyou_useless_voting',
        description: 'Would you button',
    },
    async execute(interaction, client, guildDb) {
        let wouldyouembed;
        const {WouldYou} = await require(`../languages/${guildDb.language}.json`);
        const {Useless_Powers} = await require(`../data/power-${guildDb.language}.json`);
        if (!guildDb.replay) return await interaction.reply({ephemeral: true, content: WouldYou.replays.disabled})
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands'),
        );
        const newbutton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId('wouldyou_useless_voting'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newbutton];
        } else {
            rbutton = [newbutton];
        }

        let power;
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
                name: WouldYou.embed.Usefulname,
                value: `> ${power}`,
                inline: false,
            });
        const message = await interaction.reply({
            embeds: [wouldyouembed],
            fetchReply: true,
            components: rbutton,
        }).catch((err) => {
            return;
        });
        try {
            if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                PermissionFlagsBits.AddReactions,
            ])) {
                await message.react('✅');
                await message.react('❌');
            }

            const filter = (reaction) => reaction.emoji.name === '✅' || reaction.emoji.name === '❌';

            const collector = message.createReactionCollector({
                filter,
                time: 20000,
            });

            collector.on('end', async () => {
                const msg = await message.fetch().catch((err) => {});

                if(msg) {
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

                    try {
                        if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBits.ManageMessages])) await msg.reactions.removeAll();
                    } catch (error) {
                    }
                    await interaction.editReply({
                        embeds: [wouldyouembed],
                        components: rbutton || [],
                    }).catch((err) => {
                        return collector.stop();
                    });

                    collector.stop();
                }
            });
        } catch (error) {
        }
    },
};
