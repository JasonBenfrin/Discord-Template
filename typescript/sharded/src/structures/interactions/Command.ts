import { Awaitable, ChatInputCommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, SlashCommandBuilder, Snowflake } from "discord.js";
import BotClient from "../Client.js";

type CommandBuilder = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | ContextMenuCommandBuilder
type Execute<K extends CommandBuilder> = (interaction: Omit<K extends ContextMenuCommandBuilder ? ContextMenuCommandInteraction : ChatInputCommandInteraction, 'client'> & {client: BotClient} ) => Awaitable<any>

type CommandConfigOptions<K extends CommandBuilder> = {
  builder: K,
  execute: Execute<K>
  guild?: string[],
  autocomplete?: Function
}

export class CommandConfig<K extends CommandBuilder> {
  builder: K
  execute: Execute<K>
  guild?: string[]
  autocomplete?: Function

  constructor(option: CommandConfigOptions<K>) {
    this.builder = option.builder
    this.execute = option.execute
    this.guild = option.guild
    this.autocomplete = option.autocomplete
  }
}

export default class BotCommand<K extends CommandBuilder> extends CommandConfig<K> {
  folder: string
  file: string
  id?: { [k in Snowflake]: Snowflake } | Snowflake

  constructor(option: CommandConfigOptions<K> & {
    folder: string,
    file: string
  }) {
    const { folder, file, ...superArgs } = option

    super(superArgs)
    this.folder = folder
    this.file = file
  }
}