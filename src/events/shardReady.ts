import colors from 'colors';
import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.ShardReady,
  async execute(client: ExtendedClient, id: string) {
    console.log(
      `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
        'Shard is now ready #' + id
      )}`
    );
  },
};

export default event;
