import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
export function embed({
  client,
  guildDb,
  content = guildDb.welcomeEmbedContent || "❌",
  title = guildDb.welcomeEmbedTitle || "❌",
  description = guildDb.welcomeEmbedDescription || "❌",
  author = guildDb.welcomeEmbedAuthorName || "❌",
  authorURL = guildDb.welcomeEmbedAuthorURL || "❌",
  thumbnail = guildDb.welcomeEmbedThumbnail || "❌",
  image = guildDb.welcomeEmbedImage || "❌",
  footerText = guildDb.welcomeEmbedFooterText || "❌",
  footerURL = guildDb.welcomeEmbedFooterURL || "❌",
  color = guildDb.welcomeEmbedColor || "❌",
  timestamp = guildDb.welcomeEmbedTimestamp || "❌",
}: {
  client: any;
  guildDb: any;
  content?: string;
  title?: string;
  description?: string;
  author?: string;
  authorURL?: string;
  thumbnail?: string;
  image?: string;
  footerText?: string;
  footerURL?: string;
  color?: string;
  timestamp?: boolean;
}) {
  return new EmbedBuilder()
    .setTitle(
      client.translation.get(guildDb?.language, "Settings.embed.welcomeTitle")
    )
    .setFields([
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeContent"
        ),
        value: `\`\`\`${content.slice(0, 400)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTitles"
        ),
        value: `\`\`\`${title.slice(0, 100)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeDescription"
        ),
        value: `\`\`\`${description.slice(0, 800)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeAuthorName"
        ),
        value: `\`\`\`${author.slice(0, 100)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeAuthorURL"
        ),
        value: `\`\`\`${authorURL.slice(0, 30)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeThumbnailURL"
        ),
        value: `\`\`\`${thumbnail.slice(0, 30)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeFooterText"
        ),
        value: `\`\`\`${footerText.slice(0, 100)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeFooterURL"
        ),
        value: `\`\`\`${footerURL.slice(0, 50)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeImageURL"
        ),
        value: `\`\`\`${image.slice(0, 50)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeColor"
        ),
        value: `\`\`\`${color.slice(0, 8)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTimestamp"
        ),
        value: `\`\`\`${timestamp ? "On" : "Off"}\`\`\``,
        inline: true,
      },
    ])
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });
}

export function Button1({
  client,
  guildDb,
  title = ButtonStyle.Secondary,
  author = ButtonStyle.Secondary,
  authorURL = ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  title?: ButtonStyle;
  author?: ButtonStyle;
  authorURL?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTitle")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTitle"
        )
      )
      .setStyle(title)
      .setEmoji("1185973667973320775"),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorName")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorName"
        )
      )
      .setStyle(author),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorURL")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorURL"
        )
      )
      .setStyle(authorURL)
      .setEmoji("1185973667973320775")
  );
}

export function Button2({
  client,
  guildDb,
  description = ButtonStyle.Secondary,
  thumbnail = ButtonStyle.Secondary,
  image = ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  description?: ButtonStyle;
  thumbnail?: ButtonStyle;
  image?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedDescription")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedDescription"
        )
      )
      .setStyle(description),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedThumbnail")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedThumbnail"
        )
      )
      .setStyle(thumbnail),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedImage")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedImage"
        )
      )
      .setStyle(image)
  );
}

export function Button3({
  client,
  guildDb,
  footer = ButtonStyle.Secondary,
  footerURL = ButtonStyle.Secondary,
  color = ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  footer?: ButtonStyle;
  footerURL?: ButtonStyle;
  color?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterText")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterText"
        )
      )
      .setStyle(footer),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterURL")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterURL"
        )
      )
      .setStyle(footerURL),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedColor")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedColor"
        )
      )
      .setStyle(color)
  );
}

export function Button4({
  client,
  guildDb,
  timestamp = ButtonStyle.Secondary,
  content = ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  timestamp?: ButtonStyle;
  content?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTimestamp")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTimestamp"
        )
      )
      .setStyle(timestamp),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedContent")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedContent"
        )
      )
      .setStyle(content)
  );
}

export function Button5({
  client,
  guildDb,
  toggle = ButtonStyle.Secondary,
  embed = ButtonStyle.Primary,
}: {
  client: any;
  guildDb: any;
  toggle?: ButtonStyle;
  embed?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedToggle")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedToggle"
        )
      )
      .setStyle(toggle),
    new ButtonBuilder()
      .setCustomId("welcomeEmbed")
      .setEmoji("1308672399188820023")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbed"
        )
      )
      .setStyle(embed)
  );
}

const button: Button = {
  name: "welcomeEmbedEdit",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const welcomes = embed({ client: client, guildDb: guildDb });

    const welcomeButtons = Button1({client: client, guildDb: guildDb});
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = Button5({ client: client, guildDb: guildDb });

    interaction.update({
      content: null,
      embeds: [welcomes],
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
    return;
  },
};

export default button;
