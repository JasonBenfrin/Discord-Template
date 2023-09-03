import { ClientEvents } from "discord.js";

type Execute<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => Promise<any> | any;

export default class BotEvent<K extends keyof ClientEvents> {
  declare name: K
  declare execute: Execute<K>
  declare mode : 'once' | 'on'

  constructor(options: {
    name: K,
    execute: Execute<K>,
    mode?: 'once' | 'on'
  }) {
    this.name = options.name
    this.execute = options.execute
    this.mode = options.mode ?? 'on'
  }
}