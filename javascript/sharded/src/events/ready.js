import { Events } from "discord.js";
import BotEvent from "../structures/Event.js";
import termpkg from 'terminal-kit';
const { terminal } = termpkg;
export default new BotEvent({
    name: Events.ClientReady,
    execute(client) {
        terminal
            .gray('Logged in as ')
            .blue(client.user?.tag)
            .gray(' on ')
            .blue(client.guilds.cache.size)
            .gray(' servers.\n');
    },
});
