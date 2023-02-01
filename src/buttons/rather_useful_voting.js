const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder, PermissionFlagsBits,
} = require('discord.js');
const generateRather = require('../util/generateRather');

module.exports = {
    data: {
        name: 'rather_useful_voting',
        description: 'rather useful voting',
    },
    async execute(interaction, client, guildDb) {
        const {Rather} = await require(`../languages/${guildDb.language}.json`);
        const {Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);
        if (!guildDb.replay) return await interaction.reply({ephemeral: true, content: Rather.replays.disabled})
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands',
                ),
        );
        const newButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId('rather_useful_voting'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
        } else rbutton = [newButton];
        {
            let powers = await generateRather(guildDb, Useful_Powers, "useful");
            let ratherembed = new EmbedBuilder()
                .setColor('#0598F6')
                .addFields(
                    {
                        name: Rather.embed.usefulname,
                        value: `> 1️⃣ ${powers.power1}}`,
                        inline: false,
                    },
                    {
                        name: Rather.embed.usefulname2,
                        value: `> 2️⃣ ${powers.power2}`,
                        inline: false,
                    },
                )
                .setFooter({
                    text: `${Rather.embed.footer}`,
                    iconURL: client.user.avatarURL(),
                })
                .setTimestamp();

            let message = await interaction
                .reply({
                    embeds: [ratherembed],
                    fetchReply: true,
                    components: rbutton,
                })
                .catch((err) => {
                    return;
                });
            try {
                if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                    PermissionFlagsBits.AddReactions,
                ])) {
                    await message.react('1️⃣');
                    await message.react('2️⃣');
                }

                const filter = (reaction) => reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣';

                const collector = message.createReactionCollector({
                    filter,
                    time: 20000,
                });

                collector.on('end', async () => {
                    const msg = await message.fetch().catch((err) => {
                    });

                    if(msg) {
                        const oneCount = msg.reactions.cache.get('1️⃣')?.count ?? 0;
                        const twoCount = msg.reactions.cache.get('2️⃣')?.count ?? 0;

                        if (
                            oneCount - 1
                            > twoCount - 1
                        ) {
                            ratherembed = new EmbedBuilder()
                                .setColor('#0598F6')
                                .setFooter({
                                    text: `${Rather.embed.footer}`,
                                    iconURL: client.user.avatarURL(),
                                })
                                .setTimestamp()
                                .addFields({
                                    name: Rather.embed.thispower,
                                    value: `> 1️⃣ ${powers.power1}}`,
                                    inline: false,
                                });
                        } else if (
                            oneCount - 1
                            < twoCount - 1
                        ) {
                            ratherembed = new EmbedBuilder()
                                .setColor('#0598F6')
                                .setFooter({
                                    text: `${Rather.embed.footer}`,
                                    iconURL: client.user.avatarURL(),
                                })
                                .setTimestamp()
                                .addFields({
                                    name: Rather.embed.thispower,
                                    value: `> 2️⃣ ${powers.power2}`,
                                    inline: false,
                                });
                        } else {
                            ratherembed = new EmbedBuilder()
                                .setColor('#ffffff')
                                .addFields(
                                    {
                                        name: Rather.embed.usefulname,
                                        value: `> 1️⃣ ${powers.power1}}`,
                                        inline: false,
                                    },
                                    {
                                        name: Rather.embed.usefulname2,
                                        value: `> 2️⃣ ${powers.power2}`,
                                        inline: false,
                                    },
                                )
                                .setFooter({
                                    text: `${Rather.embed.footer}`,
                                    iconURL: client.user.avatarURL(),
                                })
                                .setTimestamp();
                        }

                        try {
                            if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBits.ManageMessages])) await msg.reactions.removeAll();
                        } catch (error) {
                        }
                        await interaction
                            .editReply({
                                embeds: [ratherembed],
                                components: rbutton || [],
                            })
                            .catch((err) => {
                                return collector.stop();
                            });

                        collector.stop();
                    }
                });
            } catch (error) {
            }
        }
    },
};
