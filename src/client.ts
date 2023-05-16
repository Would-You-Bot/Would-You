import {
  ClusterClient,
  DjsDiscordClient,
  getInfo,
} from 'discord-hybrid-sharding';
import {
  Client,
  Collection,
  GatewayIntentBits,
  Options,
  User,
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import ButtonHandler from '@utils/classes/buttonHandler';
import CooldownHandler from '@utils/classes/cooldownHandler';
import DailyMessage from '@utils/classes/dailyMessage';
import DatabaseHandler from '@utils/classes/databaseHandler';
import EventHandler from '@utils/classes/eventHandler';
import KeepAlive from '@utils/classes/keepAlive';
import TranslationHandler from '@utils/classes/translationHandler';
import VoteLogger from '@utils/classes/voteLogger';
import Voting from '@utils/classes/votingHandler';
import WebhookHandler from '@utils/classes/webhookHandler';
import { logger } from './utils/client';

// User filter to filter all users out of the cache expect the bot
/* const userFilter = (user: User, client: ExtendedClient) =>
  user?.id !== client?.user?.id; */

/**
 * A custom class representing the discord client.
 */
export class ExtendedClient extends Client {
  // Client variables
  botStartTime: number = new Date().getTime();
  synced = false; // Value for client to know if its synced with database
  databaseLatency = 0;
  developers: User[] = [];
  client: ClusterClient<Client>;

  // Client functions
  logger = logger;
  // Uncomment this to bind a centralized error handler to the client
  // error = error

  // Classes
  commands: Collection<string, any> = new Collection();
  buttons: Collection<string, any> = new Collection();
  used: Record<string, any> = new Map();
  database: DatabaseHandler = new DatabaseHandler(`${config.env.MONGODB_URI}`);
  translation: TranslationHandler = new TranslationHandler();
  cooldownHandler: CooldownHandler;
  cluster: ClusterClient<DjsDiscordClient>;
  webhookHandler: WebhookHandler;
  keepAlive: KeepAlive;
  buttonHandler: ButtonHandler;
  eventHandler: EventHandler;
  dailyMessage: DailyMessage;
  voteLogger: VoteLogger;
  voting: Voting;

  constructor(customCacheOptions = {}) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      makeCache: Options.cacheWithLimits({
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildStickerManager: 0,
        PresenceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        // CategoryChannelChildManager: 0,
        MessageManager: 0,
        ReactionUserManager: {
          maxSize: 1000000,
          // ! Undefined options
          // sweepFilter: (user: User, this) => userFilter(user, this),
          // sweepInterval: 5 * 60 * 1000,
        },
        UserManager: {
          maxSize: 1000000,
          // ! Undefined options
          // sweepFilter: (user: User, this) => userFilter(user, this),
          // sweepInterval: 5 * 60 * 1000,
        },
        GuildMemberManager: {
          maxSize: 1000000,
          // ! Undefined options
          // sweepFilter: (user: User, this) => userFilter(user, this),
          // sweepInterval: 5 * 60 * 1000,
        },
        ...customCacheOptions,
      }),
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    /**
     * Initialize and start all the classes
     */

    this.buttonHandler = new ButtonHandler(this);
    this.buttonHandler.load();

    this.eventHandler = new EventHandler(this);
    this.eventHandler.load();

    this.cooldownHandler = new CooldownHandler(this);
    this.cooldownHandler.startSweeper();

    this.database.connectToDatabase();
    this.database.startSweeper(this);

    // Keep Alive system after the necessary things that are allowed to crash are loaded
    this.keepAlive = new KeepAlive(this);
    this.keepAlive.start();

    this.cluster = new ClusterClient(this);

    this.dailyMessage = new DailyMessage(this);
    this.dailyMessage.start();

    this.voteLogger = new VoteLogger(this);
    if (this?.cluster?.id === 0) this.voteLogger.startAPI();

    this.voting = new Voting(this);
    this.voting.start();

    this.webhookHandler = new WebhookHandler(this);
  }

  /**
   * Authenticate the client
   * @returns Promise<string>
   */
  public authenticate() {
    return this.login(config.BOT_TOKEN);
  }

  /**
   * Check if the client is synced with the database - used to prevent code from running unless client is synced with database
   * @returns Promise<boolean>
   */
  public isSynced() {
    return new Promise((resolve) => {
      const checkSynced = () => {
        if (this.synced === true) resolve(true);
        else setTimeout(checkSynced, 1); // check every 10ms
      };
      checkSynced();
    });
  }

  /**
   * Check if the guild has the debugMode value or user is a developer
   * @param guildDatabase The guild database
   * @param userId The user id
   * @returns boolean
   */
  public checkDebug(
    guildDatabase: GuildProfileDocument,
    userId: string
  ): boolean {
    const debugApproved =
      guildDatabase?.debugMode ?? config.developers.includes(userId);
    if (debugApproved) this.logger.debug('Debug approved');
    return debugApproved;
  }
}

export default {};
