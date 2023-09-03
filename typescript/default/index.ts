import { GatewayIntentBits } from "discord.js";
import BotClient from "./src/structures/Client.js";
import { config } from "dotenv";
config()

const client = new BotClient({
  intents: [
    GatewayIntentBits.DirectMessages
  ]
})

client.login(process.env.TOKEN)