const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { readdirSync } = require('fs');
require('dotenv').config();
const { ChalkAdvanced } = require('chalk-advanced');
const { AutoPoster } = require('topgg-autoposter');

module.exports = async (client) => {
  client.user.setPresence({
    activities: [{ name: 'Booting up...' }],
    status: 'idle',
  });


  const commandFiles = readdirSync('./src/commands/').filter((file) => file.endsWith('.js'));

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const rest = new REST({
    version: '10',
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.STATUS === 'PRODUCTION') {
        // If the bot is in production mode it will load slash commands for all guilds and upload stats to topgg
        const ap = AutoPoster(`${config.topgg}`, client);

        ap.on('posted', () => {
          console.log(
            `${ChalkAdvanced.white('Top.gg')} ${ChalkAdvanced.gray(
              '>',
            )} ${ChalkAdvanced.green(
              'Stats pushed to https://top.gg/bot/981649513427111957',
            )}`,
          );
        });

        await rest.put(Routes.applicationCommands(client.user.id), {
          body: commands,
        });
        console.log(
          `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
            '>',
          )} ${ChalkAdvanced.green(
            'Successfully registered commands globally',
          )}`,
        );
      } else {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
          {
            body: commands,
          },
        );

        console.log(
          `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
            '>',
          )} ${ChalkAdvanced.green('Successfully registered commands locally')}`,
        );
      }
    } catch (err) {
      if (err) console.error(err);
    }
  })();
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: `${process.env.BOTSTATUS}` }],
      status: 'dnd',
    });
  }, 13000);
};
