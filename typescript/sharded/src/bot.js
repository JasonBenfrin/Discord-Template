import { GatewayIntentBits } from "discord.js";
import BotClient from "./structures/Client.js";
const client = new BotClient({
    intents: [
        GatewayIntentBits.DirectMessages
    ]
});
client.login(process.env.TOKEN);
//# sourceMappingURL=bot.js.map