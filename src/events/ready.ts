import { Events } from "discord.js";
import BotEvent from "../structures/Event.js";
import BotClient from "../structures/Client.js";
import chalk from "chalk";

export default new BotEvent({
  name: Events.ClientReady,
  execute(client: BotClient) {
    console.log(
      chalk.gray('Logged in as ') +
      chalk.blue(client.user?.tag) +
      chalk.gray(' on ') +
      chalk.blue(client.guilds.cache.size) +
      chalk.gray(' servers.')
    )
  },
})