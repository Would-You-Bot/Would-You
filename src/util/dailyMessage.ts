import { Channel, EmbedBuilder, bold } from "discord.js";
import { white, gray, green } from "chalk-advanced";
import * as mom from "moment-timezone";
import { CronJob } from "cron";
import { captureException } from "@sentry/node";
import WouldYou from "./wouldYou";
import { getWouldYouRather, getWwyd } from "./Functions/jsonImport";
import { IGuildModel } from "./Models/guildModel";
import { Error } from "mongoose";

export default class DailyMessage {
  private client: WouldYou;

  constructor(client: WouldYou) {
    this.client = client;
  }

  /**
   * Start the daily message Schedule
   */
  start() {
    new CronJob(
      "0 */30 * * * *", // Every 30 seconds, minutes, every hour, every day
      () => {
        this.runSchedule();
      },
      null,
      true,
      "Europe/Berlin",
    );
  }

  /**
   * Run the daily message schedule
   * @return {Promise<void>}
   */
  async runSchedule() {
    let guilds = (
      await this.client.database.getAllActiveDailyMessageGuilds()
    ).filter(
      (guild) =>
        guild.dailyInterval === mom.tz(guild.dailyTimezone).format("HH:mm"),
    );
    if (guilds.length <= 0) {
      //Check if there are any daily messages active for guilds.
      return console.log(
        `${new Date().toISOString()}`,
        white("Daily Message"),
        gray(">"),
        green("No active daily messages"),
      );
    }
    console.log(
      white("Daily Message"),
      gray(">"),
      green(`Running daily message check for ${guilds.length} guilds`),
    );
    // Loop over every guild to get their message and send it to them trough a webhook.
    guilds.forEach(async (guild) => {
      try {
        await this.sendDaily(guild);
      } catch (error) {
        this.handleError(new Error(error as string), guild);
      }
    });
    return; // REMOVE ME

    // let i = 0;
    // for (const db of guilds) {
    //   if (!db?.dailyChannel) continue;
    //   if (!db.dailyMsg) continue;
    //   i++;
    //   setTimeout(async () => {
    //     const channel = await this.client.channels
    //       .fetch(db.dailyChannel)
    //       .catch(async (err) => {
    //         captureException(err);
    //         await this.client.database.updateGuild(db?.guildID, {
    //           db,
    //           dailyMsg: false,
    //         });
    //       });

    //     if (!channel?.id) {
    //       await this.client.database.updateGuild(db?.guildID, {
    //         db,
    //         dailyMsg: false,
    //       });
    //       return;
    //     } // Always directly return before do to many actions

    //     let randomDaily: any;
    //     let dailyId;

    //     dailyId = Math.floor(Math.random() * randomDaily.length);

    //     const embed = new EmbedBuilder()
    //       .setColor("#0598F6")
    //       .setFooter({
    //         text: `Daily Message | Type: ${db.customTypes.replace(/^\w/, (c) =>
    //           c.toUpperCase(),
    //         )} | ID: ${dailyId}`,
    //       })
    //       .setDescription(bold(randomDaily) as string);
    //     const debugChannel = (await this.client.channels.fetch(
    //       "1192118227497652276",
    //     )) as any;

    //     if (!debugChannel) return console.log("No debug channel found");

    //     await debugChannel?.send({
    //       content: "Sending webhook message line 145 dailymessage.ts",
    //     });
    //     await this.client.webhookHandler
    //       .sendWebhook(
    //         channel,
    //         db.dailyChannel,
    //         {
    //           embeds: [embed],
    //           content: db.dailyRole ? `<@&${db.dailyRole}>` : null,
    //         },
    //         db.dailyThread,
    //       )
    //       .catch(async (err) => {
    //         captureException(err);
    //         await this.client.database.updateGuild(db?.guildID, {
    //           db,
    //           dailyMsg: false,
    //         });
    //       });

    //     return await this.client.database.updateGuild(db?.guildID, {
    //       lastUsageTimestamp: Date.now(),
    //     });
    //   }, i * 2500); // We do a little timeout here to work against discord ratelimit with 50reqs/second
    // }
  }
  private async sendDaily(guild: IGuildModel): Promise<void> {
    let randomDaily = await this.getDailyMessage(guild);
    let channel = await this.getDailyMessageChannel(guild);
    if (!channel) {
      return this.handleError(
        new Error("No channel has been fetched to post a daily message to!"),
        guild,
      );
    }
    if (!randomDaily) {
      return this.handleError(
        new Error("No random question has been fetched!"),
        guild,
      );
    }
    let embed = this.buildEmbed(
      randomDaily[0],
      randomDaily[1],
      guild.customTypes,
    );
    if (!embed) {
      return this.handleError(
        new Error(
          `Failed to build daily message embed for guild ${guild.guildID}`,
        ),
        guild,
      );
    }
    return this.sendWebhook(channel, embed, guild);
  }
  private async getDailyMessageChannel(
    guild: IGuildModel,
  ): Promise<Channel | null> {
    return await this.client.channels.fetch(guild.dailyChannel);
  }
  private async getDailyMessage(
    guild: IGuildModel,
  ): Promise<[string, number] | null> {
    const General = await getWouldYouRather(guild.language); // Fetch all general questions with the specified guild language
    const WhatYouDo = await getWwyd(guild.language); // Fetch all WouldYou questions with the specified guild language
    let allMessageArray = []; //Create a funcion scoped array to store all questions.
    // Populate the allMessageArray with all the regular questions.
    if (guild.customTypes === "regular") {
      allMessageArray.push(...General, ...WhatYouDo);
    }
    // Populate the allMessageArray with all custom messages and the regular questions.
    if (guild.customTypes === "mixed") {
      allMessageArray.push(...General, ...WhatYouDo);
      if (guild.customMessages.length <= 0) {
        let id = Math.floor(Math.random() * allMessageArray.length);
        return [allMessageArray[id], id];
      }
      guild.customMessages.forEach((message) =>
        allMessageArray.push(message.msg),
      );
    }
    // Populate the allMessageArray with all custom messages.
    if (guild.customTypes === "custom") {
      guild.customMessages.forEach((message) =>
        allMessageArray.push(message.msg),
      );
    }
    // Handle the allMessageArray and send a return a random question or 0
    if (allMessageArray.length <= 0) return null;
    let id = Math.floor(Math.random() * allMessageArray.length);
    return [allMessageArray[id], id];
  }
  private async sendWebhook(
    channel: Channel,
    embed: EmbedBuilder,
    guild: IGuildModel,
  ): Promise<void> {
    try {
      await this.client.webhookHandler.sendWebhook(
        channel,
        guild.dailyChannel,
        {
          embeds: [embed],
          content: guild.dailyRole ? `<@&${guild.dailyRole}>` : null,
        },
        guild.dailyThread,
      );
    } catch (error) {
      this.handleError(new Error(error as string), guild);
    } finally {
      return;
    }
  }
  private async handleError(error: Error, guild: IGuildModel): Promise<void> {
    console.error(error);
    captureException(error);
    await this.client.database.updateGuild(guild.guildID, {
      guild,
      dailyMsg: false,
    });
  }
  private buildEmbed(question: string, id: number, type: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Daily Message | Type: ${type.replace(/^\w/, (c) =>
          c.toUpperCase(),
        )} | ID: ${id}`,
      })
      .setDescription(bold(question) as string);
  }
}
