import { Awaitable, ModalSubmitInteraction } from "discord.js";
import BotClient from "../Client.js";

type Execute = (interaction: Omit<ModalSubmitInteraction, 'client'> & {client: BotClient}) => Awaitable<any>

export default class BotModal {
  name: string;
  execute: Execute;
  
  constructor(options: {
    name: string,
    execute: Execute
  }) {
    this.name = options.name
    this.execute = options.execute
  }
}