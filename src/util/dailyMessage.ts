import { Channel, EmbedBuilder, bold } from "discord.js";
import WouldYou from "./wouldYou";
import amqplib, { MessageProperties } from "amqplib";
import { IQueueMessage, Result } from "../global";
import QueueError from "./Error/QueueError";
import { Scope, captureException, withScope } from "@sentry/node";

export default class DailyMessage {
  private client: WouldYou;
  constructor(client: WouldYou) {
    this.client = client;
  }
  /**
   * Start the daily message Schedule
   */
  async listen() {
    console.log(this.client.cluster.count);
    const URL = process.env.RABBITMQ_URL || "fallback";
    const connection = await amqplib.connect(URL);
    let QUEUE = `cluster-${this.client.cluster.id}`;
    if (connection) {
      const channel = await connection.createChannel();
      if (channel) {
        channel.prefetch(1);
        await channel.assertQueue(QUEUE, {
          durable: false,
          deadLetterExchange: "DLX",

          deadLetterRoutingKey: "nVZzaJrwJ9",
        });
        channel.consume(QUEUE, async (message) => {
          if (message) {
            setTimeout(async () => {
              try {
                const result = await this.sendDaily(
                  <IQueueMessage>JSON.parse(message.content.toString()),
                  message.properties,
                );
                if (!result.success) {
                  const error: QueueError = new QueueError(
                    `Could not acknowledge queue message`,
                    {
                      error: result.error,
                      id: message.properties.messageId,
                      guildId: (
                        JSON.parse(message.content.toString()) as IQueueMessage
                      ).guildId,
                      context: message.properties.deliveryMode,
                    },
                  );
                  this.captureError(error, QUEUE);
                  this.handleReject(channel, error.causeError.message, message);
                } else {
                  channel.ack(message);
                }
              } catch (error) {
                this.handleReject(channel, (error as Error).message, message);
                this.captureError(error as Error, QUEUE);
              }
            }, 1000); // (NOTE) Update this to increase wait time
          }
        });
      }
    }
  }
  /**
   * @name sendDaily
   * @description handle the daily message and sent it to the webhookhandler.
   * @param message
   * @returns Promise<void>
   * @author Nidrux
   */
  private async sendDaily(
    message: IQueueMessage,
    properties: MessageProperties,
  ): Promise<Result<string>> {
    if (message.channelId == null) {
      return {
        success: false,
        error: new Error("No channel id provided by the queue message!"),
      };
    }
    if (!this.client.guilds.cache.has(message.guildId)) {
      return {
        success: false,
        error: new Error(
          `Wrong cluster: ${process.pid} - ${properties.messageId}`,
        ),
      };
    }

    let channel = await this.getDailyMessageChannel(message.channelId);
    let embed = this.buildEmbed(
      message.message[0],
      message.message[1],
      message.type,
      properties.messageId,
    );
    if (!embed) {
      return {
        success: false,
        error: new Error(
          `Failed to build daily message embed for guild ${message.guildId}`,
        ),
      };
    }
    if (!channel.success) {
      return {
        success: false,
        error: new Error(
          `No channel has been fetched to post a daily message to! ${message.guildId}`,
          { cause: channel.error },
        ),
      };
    }
    const result = await this.sendWebhook(channel.result, embed, message);
    if (result.success) {
      return { success: true, result: "I have send the webhook" };
    } else {
      return { success: false, error: result.error };
    }
  }
  /**
   * @name getDailyMessageChannel
   * @param guild
   * @returns
   * @author Nidrux
   */
  private async getDailyMessageChannel(
    channelId: string,
  ): Promise<Result<Channel>> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (channel) return { success: true, result: channel };
      else
        return { success: false, error: new Error("fetched channel is null") };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  /**
   * @description Send the embed to the webhookhandler
   * @param channel
   * @param embed
   * @param guild
   * @returns Promise<void>
   * @author Nidrux
   */
  private async sendWebhook(
    channel: Channel,
    embed: EmbedBuilder,
    message: IQueueMessage,
  ): Promise<Result<string>> {
    try {
      const result = await this.client.webhookHandler.handleWebhook(
        channel,
        {
          embeds: [embed],
          content: message.role ? `<@&${message.role}>` : null,
          avatarURL:
            "https://cdn.discordapp.com/avatars/981649513427111957/23da96bbf1eef64855a352e0e29cdc10.webp?size=96", // Make sure to update this if you ever change the link thx <3 // @SANS USE THIS TO SET AVATAR <3
          username: "Would You", // @SANS USE THIS TO SET USERNAME <3
        },
        message,
        message.thread,
      );
      return result;
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }
  /**
   *
   * @param question
   * @param id
   * @param type
   * @returns EmbedBuilder
   * @author Nidrux
   */
  private buildEmbed(
    question: string,
    id: number,
    type: string,
    qid: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Daily Message | Type: ${type.replace(/^\w/, (content) =>
          content.toUpperCase(),
        )} | ID: ${id} QID: ${qid}`,
      })
      .setDescription(bold(question) as string);
  }
  /**
   *
   * @param error
   * @param queue
   * @author Nidrux
   */
  private captureError(error: Error, queue: string): void {
    withScope((scope) => {
      scope.setLevel("fatal");
      scope.setTag("queue", queue);
      captureException(error);
    });
  }
  private handleReject(
    channel: amqplib.Channel,
    reason: string,
    message: amqplib.Message,
  ) {
    const headers = { rejectionCause: reason };
    channel.publish("DLX", "key", message.content, {
      headers: headers,
      messageId: message.properties.messageId,
    });
    channel.ack(message);
  }
}
