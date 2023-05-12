import { SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../structures/interactions/Command.js";

export default new CommandConfig({
  builder: new SlashCommandBuilder(),
  execute(interaction) {
    
  },
})