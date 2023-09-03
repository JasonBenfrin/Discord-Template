import { SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../../structures/interactions/Command.js";
export default new CommandConfig({
    builder: new SlashCommandBuilder()
        .setName('example')
        .setDescription('An example command.'),
    execute(interaction) {
    },
});
