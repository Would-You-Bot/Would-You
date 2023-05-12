import config from '@config';
import { CoreEvent } from '@typings/core';
import { Events } from 'discord.js';

const event: CoreEvent = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    const restrict = [
      'dailyChannel',
      'replayType',
      'replayDelete',
      'replayDeleteChannels',
      'replayChannels',
      'selectMenuReplay',
      'welcomeChannel',
      'dailyInterval',
      'dailyType',
      'replayCooldown',
      'welcomePing',
      'welcome',
      'welcomeChannel',
      'dailyRole',
      'dailyTimezone',
      'dailyMsg',
      'dailyThread',
      'votemodal',
    ];
    if (!interaction.guild) {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
          command.execute(interaction, client, null);
        } catch (err) {
          if (err) console.error(err);
          return interaction.reply({
            content: 'An error occurred while trying to execute that command.',
            ephemeral: true,
          });
        }
      }
    } else {
      const guildDb = await client.database.getGuild(
        interaction.guild.id,
        true
      );

      if (!guildDb) return;

      // ? const { inter } = require(`../languages/${guildDb.language || "en_EN"}.json`);

      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          command.execute(interaction, client, guildDb);
        } catch (err) {
          if (err) console.error(err);
          interaction.reply({
            content: 'An error occurred while trying to execute that command.',
            ephemeral: true,
          });
        }
      } else if (interaction.isButton()) {
        if (client.used.has(interaction.user.id)) {
          return interaction
            .reply({
              ephemeral: true,
              content: `<t:${Math.floor(
                guildDb.replayCooldown / 1000 + Date.now() / 1000
              )}:R> you can use buttons again!`,
            })
            .catch(() => {});
        } else if (
          guildDb.replayType === 'Channels' &&
          client.used.has(`${interaction.user.id}-${interaction.channel.id}`)
        ) {
          return interaction
            .reply({
              ephemeral: true,
              content: `<t:${Math.floor(
                (guildDb.replayChannels.find(
                  (x) => x.id === interaction.channel.id
                )?.cooldown || 1000) /
                  1000 +
                  Date.now() / 1000
              )}:R> you can use buttons again!`,
            })
            .catch(() => {});
        }

        let button = client.buttons.get(interaction.customId);
        if (interaction.customId.startsWith('voting_'))
          button = client.buttons.get('voting');
        if (interaction.customId.startsWith('result_'))
          button = client.buttons.get('result');
        if (!button)
          return interaction
            .reply({
              content: 'Please use the command again.',
              ephemeral: true,
            })
            .catch(() => {});

        try {
          if (
            !restrict.includes(interaction.customId) &&
            !interaction.customId.startsWith('voting_') &&
            !interaction.customId.startsWith('result_')
          ) {
            if (
              guildDb.replayType === 'Channels' &&
              guildDb.replayChannels.find(
                (x) => x.id === interaction.channel.id
              )
            ) {
              client.used.set(
                `${interaction.user.id}-${interaction.channel.id}`,
                Date.now() +
                  (guildDb.replayChannels.find(
                    (x) => x.id === interaction.channel.id
                  )?.cooldown || 1000)
              );
              setTimeout(
                () =>
                  client.used.delete(
                    `${interaction.user.id}-${interaction.channel.id}`
                  ),
                guildDb.replayChannels.find(
                  (x) => x.id === interaction.channel.id
                )?.cooldown || 1000
              );
            } else {
              client.used.set(
                interaction.user.id,
                Date.now() + guildDb.replayCooldown
              );
              setTimeout(
                () => client.used.delete(interaction.user.id),
                guildDb.replayCooldown
              );
            }
          }

          return button.execute(interaction, client, guildDb);
        } catch (err) {
          if (err) console.error(err);
          return interaction.reply({
            content: 'An error occurred while trying to execute that command.',
            ephemeral: true,
          });
        }
      } else {
        const button = client.buttons.get(interaction.customId);
        if (button) return button.execute(interaction, client, guildDb);
      }
    }
  },
};

export default event;
