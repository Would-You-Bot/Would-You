declare global {
  var devBot: boolean;
  var wouldYouDevs: string[];
  var checkDebug: (d, i) => boolean;
  type CanJSON =
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly CanJSON[]
    | { readonly [key: string]: CanJSON }
    | { toJSON(): CanJSON };
  enum Days {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
  }
}

/**
 * Everything underneath this is used by the daily message service.
 * Result<T,E> is used to elevate the possible error messages to our dailymessage listen function, this so we can get an exact error message when something goes wrong (cause)
 * DONT TOUCH UNLESS NEEDED.
 */
export interface IQueueMessage {
  guildId: string;
  message: [string, number];
  type: string;
  role: string | null;
  thread: boolean;
  premium: number;
  autoPin: boolean;
  webhook: {
    avatar: string;
    name: string;
    id: string | null;
    token: string | null;
  };
  channelId: string | null;
  retries: number;
  location: {
    shard: number;
    cluster: number;
  };
}
export type Result<T, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };
