import { Events } from "discord.js";
import BotEvent from "../structures/Event.js";
import BotClient from "../structures/Client.js";
import termpkg from 'terminal-kit'
const { terminal } = termpkg

export default new BotEvent({
  name: Events.ClientReady,
  execute(client: BotClient) {
    terminal
      .gray('Logged in as ')
      .blue(client.user?.tag)
      .gray(' on ')
      .blue(client.guilds.cache.size)
      .gray(' servers.\n')
  },
})