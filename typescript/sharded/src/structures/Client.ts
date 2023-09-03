import { Client, Collection, ClientOptions } from "discord.js";
import BotCommand, { CommandConfig } from "./interactions/Command.js";
import { readdirSync, statSync } from 'fs'
import BotEvent from "./Event.js";
import BotButton from "./interactions/Button.js";
import BotModal from "./interactions/Modal.js";

export default class BotClient extends Client {
  commands?: Collection<string, BotCommand<any>>
  buttons?: Collection<string, BotButton>
  modals?: Collection<string, BotModal>;

  constructor(options: ClientOptions) {
    super(options)

    this.commands = new Collection()
    this.buttons = new Collection()
    this.modals = new Collection()

    // Command loader
    const commandsDir = './src/interactions/commands/'
    readdirSync(commandsDir).forEach( folderName => {
      const commandFolderPath = commandsDir + folderName
      if (!statSync(commandFolderPath).isDirectory()) return

      readdirSync(commandFolderPath)
        .filter( fileName => fileName.endsWith('.ts'))
        .forEach( async fileName => {
          const commandConfig: CommandConfig<any> = (await import(`../interactions/commands/${folderName}/${fileName}`)).default
          const command = new BotCommand({
            ...commandConfig,
            folder: folderName,
            file: fileName
          })
          this.commands?.set(command.builder.name, command)
        })
    })

    // Events loader
    readdirSync('./src/events')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const event: BotEvent<any> = (await import(`../events/${fileName}`)).default
        this[event.mode](event.name, (...args) => event.execute(...args))
      })

    // Buttons loader
    readdirSync('./src/interactions/buttons')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const buttons: BotButton[] = (await import(`../interactions/buttons/${fileName}`)).default
        buttons.forEach(button => {
          this.buttons?.set(button.name, button)
        })
      })

    // Modals loader
    readdirSync('./src/interactions/modals')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const modals: BotModal[] = (await import(`../interactions/modals/${fileName}`)).default
        modals.forEach(modal => {
          this.modals?.set(modal.name, modal)
        })
      })

    // Uncomment this for debugging purposes
    // this.on('debug', console.log)
  }
}