import { Awaitable, ButtonInteraction } from "discord.js";
import BotClient from "../Client.js";

type Execute = (interaction: Omit<ButtonInteraction, 'client'> & {client: BotClient}) => Awaitable<any>

export default class BotButton {
  name: string
  execute: Execute

  constructor(options: {
    name: string,
    execute: Execute
  }) {
    this.name = options.name
    this.execute = options.execute
  }
}