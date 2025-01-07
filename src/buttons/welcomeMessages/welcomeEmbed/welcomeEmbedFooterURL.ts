import { ButtonStyle } from "discord.js";
import type { Button } from "../../../interfaces";
import { Modal, type ModalData } from "../../../util/modalHandler";
import { welcomeEmbed } from "../../../util/Models/zod/welcomeEmbed";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  SelectMenu,
} from "../welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedFooterURL",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Set Footer URL",
      customId: "WelcomeEmbedEdit",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "What should the footer URL be?",
          required: true,
          placeholder: "https://i.imgur.com/zw4yhxv.jpeg",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;

    const schema = welcomeEmbed({ guildDb: guildDb, footerURL: value });

    if (
      guildDb.welcomeEmbed &&
      schema.error &&
      schema?.error?.errors.length! > 0
    ) {
      const errors = schema?.error?.errors;
      await (data?.modal as any).reply({
        content: errors?.map((err) => `${err.path}: ${err.message}`).join("\n"),
        ephemeral: true,
      });
      return;
    }

    const welcome = embed({
      client: client,
      guildDb: guildDb,
      footerURL: value,
    });

    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({
      client: client,
      guildDb: guildDb,
      footerURL: ButtonStyle.Success,
    });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = SelectMenu(client, guildDb);

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcomeEmbedFooterURL: value,
    });

    await (data?.modal as any).update({
      embeds: [welcome],
      components: [
        welcomeButtons,
        welcomeButtons2,
        welcomeButtons3,
        welcomeButtons4,
        welcomeButtons5,
      ],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
