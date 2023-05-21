import { BotTranslations, CoreTranslations, GameTranslations, Translations } from '@typings/translations';

const core: CoreTranslations = {
  name: 'Would You',
  description:
    'Would You bot is an open-source discord bot that includes activities and questions to keep your server active!',
  error: {
    interaction: 'An error occurred. Please try again later.',
    cooldown: 'You need to wait {cooldown} seconds before using this command again.',
    permissions: 'You are missing the following permissions to use this interaction: {permissions}.',
  },
};

const bot: BotTranslations = {
  settings: {
    timezone: {
      same: 'The provided timezone is the same timezone that is already set. Make sure to choose a different timezone.',
      invalid:
        'Provided timezone was invalid, you can pick a valid timezone from this [Time Zone Picker](https://kevinnovak.github.io/Time-Zone-Picker/)',
    },
    questionType: {
      same: 'The provided question type is the same type that is already set. Make sure to choose a different type.',
    },
    daily: {
      content: {
        channel: 'Select the channel where you want Daily Messages to be.',
        role: 'Select a role that you want to be pinged in Daily Messages.',
        sameTime:
          'The provided interval is the same interval that is already set. Make sure to choose a different interval.',
        invalidTime:
          'Provided interval was invalid. Make sure your interval is in the 24h format and mintues are either 00 or 30!',
      },
      embed: {
        title: '{name} - Daily Messages',
        description:
          '**Enabled:**\n{enabled}\n**Channel:**\n{channel}\n**Role:**\n{role}\n**Time:**\n{time}\n**Thread:**\n{thread}',
      },
      button: {
        enabled: {
          enable: 'Enable',
          disable: 'Disable',
        },
        channel: 'Set Channel',
        role: 'Set Role',
        time: 'Set Time',
        thread: {
          enable: 'Enable Thread',
          disable: 'Disable Thread',
        },
      },
    },
    interface: {
      general: {
        embed: {
          title: '{name} - General Settings',
          description: `**Timezone**\n{timezone}\n**Question Type**\n{questionType}`,
        },
      },
      welcome: {
        embed: {
          title: '{name} - Welcomes',
          description: '**Enabled:**\n{enabled}\n**Channel:**\n{channel}\n**User Pings:**\n{ping}',
        },
      },
    },
  },
  ping: {
    embed: {
      title: '🏓 Pong!',
      api: 'API Latency',
      client: 'Client Latency',
    },
    button: {
      label: 'Discord API latency',
    },
  },
  language: {
    embed: {
      error: 'You are missing the `Manage Guild` permission to use this command!',
    },
  },
  support: {
    embed: {
      title: '{name} - Support',
      description:
        'If you ever need help with anything, just contact the **support team** on our **[Support Server](https://discord.gg/vMyXAxEznS)!**',
    },
  },
  help: {
    embed: {
      title: 'Help',
      description: '**{name}** is a discord bot built to increase discord server activity.',
      fields: [
        {
          name: '**My Commands**',
          value:
            '`/Would You` - Start a discussion about random powers\n`/ping` - Pong!\n`/language` - Change the language of the bot for the server\n`/help` - Shows this info\n`/rather` - Gives you two powers to choose from\n`/custom` - Sends a custom would you message in the chat!\n`/wwyd` - Sends a what would you do question in the chat\n`/welcome` - Add or remove the welcome channel!\n`/support` - If you ever need help on the bot, use this command to get help from the support team!',
        },
        {
          name: '**Privacy Policy**',
          value:
            'We value your privacy. If you have any concerns about your data, check out privacy policy [here](https://wouldyoubot.gg/privacy).',
        },
      ],
    },
    button: {
      label: 'Our Discord',
    },
  },
  guide: {
    embed: {
      title: '{name} - Guide',
      description: 'Guide to use the full potential of {name}.',
      fields: [
        {
          name: 'How to correctly use {name}!',
          value:
            "Create a dedicated channel for the bot or allow users to use the bot in the main chat. \n > {name}'s purpose is to make chats more active so it would be very ironic to deny the usage of {name} in main chats. \n > If you want to use the bot to its fullest potential, use the </welcome:1011374285350260914> command and setup a welcome channel. The channel will be used to send a {name} message once a user joins.",
        },
        {
          name: 'Why do I need that?',
          value:
            '> The intention behind this is to help new users be part of the conversation by giving the members a topic to talk about right after joining! This not only makes the server more active, but it also makes new users feel more included right after joining the server and encourages them to stay for longer!',
        },
        {
          name: 'Any more tips?',
          value:
            '> Yes! Make sure to talk about the topic you got instead of spamming the commands. This will help the members build a conversation and make the server more active in minutes! There is an image attached with a prime example on how to use the bot!',
        },
      ],
    },
  },
  vote: {
    embed: {
      title: 'Voting helps **Would You** gain more users! Make sure to vote every day!',
    },
    button: {
      label: 'Vote',
    },
  },
};

const game: GameTranslations = {
  wwyd: {
    embed: {
      title: 'What **would you** do?',
      footer: 'Explain what and why',
      option1: 'Option 1',
      option2: 'Option 2',
    },
  },
  wyr: {
    embed: {
      title: 'Would you rather',
    },
    button: {
      custom: 'Would you rather',
    },
  },
};

const translations: Translations = {
  ...core,
  ...bot,
  ...game,
};

const old = {
  wyCustom: {
    error: {
      paginate: "You can't proceed that way any further.",
      maximum: "You've reached the maximum amount of custom messages. You can gain more by voting for the bot!",
      empty: 'There currently is no custom Would You messages to view!',
      import: {
        att1: 'You need to provide a valid JSON file!',
        att2: 'You need to provide a valid JSON file!',
        att3: "The JSON you provided didn't have any data in it! Example: [here](https://cdn.discordapp.com/attachments/945100320973934653/1017597246189097030/unknown.png)",
        att4: "The JSON you provided didn't have any custom messages! Example: [here](https://cdn.discordapp.com/attachments/945100320973934653/1017597246189097030/unknown.png)",
        att5: "The JSON you provided didn't have any custom messages! Example: [here](https://cdn.discordapp.com/attachments/945100320973934653/1017597246189097030/unknown.png)",
        att15: 'There was an error that occured while running this command, please report it to the support server!',
        att16:
          'The JSON you provided had too much data for the wouldyourather category, we only accept 30 custom messages. You can gain more by voting for the bot!',
        att17:
          'The JSON you provided had too much data for the neverhaveiever category, we only accept 30 custom messages. You can gain more by voting for the bot!',
        att18:
          'The JSON you provided had too much data for the wwyd category, we only accept 30 custom messages. You can gain more by voting for the bot!',
        att19:
          "You can't have more than 30 custom messages in an import for the wouldyourather category. You can gain more by voting for the bot!",
        att20:
          "You can't have more than 30 custom messages in an import for the neverhaveiever category. You can gain more by voting for the bot!",
        att21:
          "You can't have more than 30 custom messages in an import for the wwyd category. You can gain more by voting for the bot!",
        att22:
          'Adding up your current **wouldyourather** custom messages and the ones in your file, this will go over 30 which is the limit. You can gain more by voting for the bot!',
        att23:
          'Adding up your current **neverhaveiever** custom messages and the ones in your file, this will go over 30 which is the limit. You can gain more by voting for the bot!',
        att24:
          'Adding up your current **wwyd** custom messages and the ones in your file, this will go over 30 which is the limit. You can gain more by voting for the bot!',
      },
      export: {
        none: "You don't have any custom messages to export!",
      },
    },
    success: {
      import: 'Successfully imported those custom messages!',
      export: 'Successully exported your custom messages!',
      embedAdd: {
        title: 'Successfully created that Would You message!',
        descID: 'ID',
        descMsg: 'Message',
        descCat: 'Category',
        descCont: 'Content',
      },
      embedRemove: {
        title: 'Successfully removed that custom Would You message!',
      },
      embedRemoveAll: {
        title: 'Are you sure you want to delete every Would You custom message?',
        accept: 'Successfully deleted all of the Would You custom messages!',
        decline: 'You declined deleting all of Would You custom messages.',
        none: "You currently don't have any Would You custom messages to delete!",
      },
      paginator: {
        title: 'Would You Custom Messages',
        descCatUseful: '**Category**: useful',
        descCatUseless: '**Category**: useless',
      },
    },
  },
  wyType: {
    embed: {
      title: 'Would You Type Changed!',
      descDef: 'Default messages will now be used for Would You commands.',
      descBoth: 'Both default messages and custom messages will be used for Would You commands.',
      descCust: 'Custom messages will now be used for Would You commands.',
    },
  },
  Custom: {
    embed: {
      title: 'Would you want this power?',
      footer: 'Would You',
    },
  },
  WouldYou: {
    embed: {
      Usefulname: 'Would you want this power?',
      Uselessname: 'Would you want this power?',
      footer: 'Would You',
    },
    replays: {
      disabled: 'Replaying in this server is currently disabled!',
    },
    stats: {
      of: 'of',
      taking: ' would take this power.',
      user: 'user',
      users: 'users',
    },
  },
  Random: {
    embed: {
      text1: 'Would you want this power but',
      text2: 'can choose a side effect?',
      footer: 'Would You',
    },
  },
  Vote: {
    embed: {
      title: 'Voting helps **Would You** gain more users! Make sure to vote every day!',
      value: 'Click to vote',
      footer: 'Would You',
    },
  },
  Rather: {
    embed: {
      uselessname: 'Would you rather',
      uselessname2: 'or',
      usefulname: 'Would you rather',
      usefulname2: 'or',
      footer: 'Would You Rather',
      thispower: 'According to the vote the majority of users would prefer:',
    },
    replays: {
      disabled: 'Replaying in this server is currently disabled!',
    },
    button: {
      nocustom:
        "There's currently no custom Would You messages to be displayed! Either make some or change the type using /Would You type",
    },
  },
  REPLAY: {
    embed: {
      title: 'Would You Replays',
      description: "You've successfully set Replay to",
      errorDesc: 'In order to use this command you need to vote for the bot!',
      errorAlready: 'Replaying is already disabled',
      errorAlready2: 'Replaying is already enabled',
      cooldownSuccess: 'Successfully put cooldown for ',
      cooldownSuccess2: ' seconds!',
      success: 'Replay has been disabled successfully',
      missingPerms: 'You are missing the `Manage Server` permission to use this command.',
    },
  },
  inter: {
    error: 'An error occurred while trying to execute that command.',
    wait: 'You need to wait 30 seconds between every button press.',
    again: 'Please use the command again.',
  },
  webhookManager: {
    noWebhook:
      "Due to a necessary change for performance, I need **Manage Webhooks** permissions to send this message! (If I have these permissions but this message still appears, make sure it\\'s possible for me to create a Webhook!",
  },
  Settings: {
    errorSame:
      'The provided timezone is the same timezone that is already set. Make sure to choose a different timezone.',
    errorInvalid:
      'Provided timezone was invalid, you can pick a valid timezone from this [Time Zone Picker](https://kevinnovak.github.io/Time-Zone-Picker/)',
    intervalSame:
      'The provided interval is the same interval that is already set. Make sure to choose a different interval.',
    intervalInvalid:
      'Provided interval was invalid. Make sure your interval is in the 24h format and mintues are either 00 or 30!',
    dailyChannel: 'Select a channel where you want Daily Messages to be!',
    replayChannel: 'Select a channel that you want to add a replay cooldown to!',
    replayChannelNone: "You don't have any replay channels set!",
    replayCooldownMin: 'Provided cooldown is too short, make sure cooldowns are above 2 seconds! (2000 milliseconds)',
    replayChannelAlready: 'The provided channel already has a cooldown!',
    replayDelete: 'Select a channel that you want to remove a replay cooldown from!',
    cooldownTooLong:
      'Provided cooldown was too long. Make sure the cooldown is less than 6 hours (21600000 milliseconds)!',
    replayChannelLimit: 'You can only add 15 channels to the replay cooldown!',
    dailyType: 'Select a type of Daily Message you want to be sent!',
    dailyRole: 'Select a role that you want to be pinged in Daily Messages!',
    replaySame:
      'The provided replay cooldown is the same cooldown that is already set. Make sure to choose a different cooldown.',
    voteSame:
      'The provided vote cooldown is the same cooldown that is already set. Make sure to choose a different cooldown.',
    cooldownInvalid: 'Provided cooldown was invalid. Make sure the cooldown only includes numbers!',
    embed: {
      error: "You don't have the required permissions to use this command.",
      generalTitle: 'Would You - General Settings',
      replayCooldown: '**Replay Cooldown**',
      replayType: '**Replay Type**',
      replayChannels: '**Replay Channels**',
      replayChannelsNone: 'None',
      dailyInterval: '**Interval**',
      dailyTitle: 'Would You - Daily Messages',
      dailyType: '**Type**',
      dailyMsg: '**Enabled**',
      dailyRole: '**Role**',
      dailyChannel: '**Channel**',
      dailyTimezone: '**Timezone**',
      dailyThread: '**Thread**',
      welcomeTitle: 'Would You - Welcomes',
      welcome: '**Enabled**',
      welcomeChannel: '**Channel**',
      welcomePing: '**User Pings**',
      footer: 'Would You',
    },
    button: {
      dailyInterval: 'Set Interval',
      dailyChannel: 'Set Channel',
      dailyRole: 'Set Role',
      dailyTimezone: 'Set Timezone',
      dailyType: 'Set Type',
      dailyThread: 'Toggle threads',
      dailyMsg: 'Toggle Daily Messages',
      replayCooldown: 'Set Replay Cooldown',
      replayDeleteChannels: 'Delete Replay Channels',
      replayType: 'Replay Type',
      welcomeChannel: 'Set Channel',
      welcome: 'Toggle Welcomes',
      welcomePing: 'Toggle User Ping',
    },
  },
  Debug: {
    permissions: "You don't have the required permissions to use this command.",
    channelNotSet: "The channel for the daily message isn't set or I cant access to it.",
    tryToSent: 'I will try to sent a test message now! If nothing happen check the support server of the bot!',
    testMessage: 'This is a test message to check if the webhook for daily messages works.',
    enabled:
      'Debug mode is now **enabled**. Keep in mind that the Devs of WouldYou can now access commands **without** having the needed permissions!',
    disabled:
      'Debug mode is now **disabled**. Keep in mind that the Devs of WouldYou can no longer access commands **without** having the needed permissions!',
    embed: {
      title: 'Debug',
      settings: 'Settings',
      isChannel: 'This channel **{is}** the daily message channel.',
      is: 'is',
      isnot: 'is not',
      channel: 'This channel',
      can: 'can',
      cannot: "can't",
      manageWebhook: 'I **{can}** manage webhooks in this channel.',
      embedLinks: 'I **{can}** send embeds in this channel.',
      sendMessages: 'I **{can}** send messages in this channel.',
      viewChannel: 'I **{can}** view this channel.',
      readMessageHistory: 'I **{can}** read the message history in this channel.',
      global: 'Global',
      g_manageWebhooks: 'I **{can}** manage webhooks on this server.',
      g_embedLinks: 'I **{can}** send embeds on this server.',
      g_sendMessages: 'I **{can}** send messages on this server.',
      g_viewChannel: 'I **{can}** view channels on this server.',
      g_readMessageHistory: 'I **{can}** read the message history on this server.',
    },
  },
  Voting: {
    Yes: 'Yes',
    No: 'No',
    Vote: 'Vote: ',
    VotingResults: 'Voting Results',
  },
};

export default translations;
