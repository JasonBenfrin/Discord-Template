import { Client, Collection } from "discord.js";
import BotCommand from "./interactions/Command.js";
import { readdirSync, statSync } from 'fs';
export default class BotClient extends Client {
    commands;
    buttons;
    modals;
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.buttons = new Collection();
        this.modals = new Collection();
        // Command loader
        const commandsDir = './src/interactions/commands/';
        readdirSync(commandsDir).forEach(folderName => {
            const commandFolderPath = commandsDir + folderName;
            if (!statSync(commandFolderPath).isDirectory())
                return;
            readdirSync(commandFolderPath)
                .filter(fileName => fileName.endsWith('.js'))
                .forEach(async (fileName) => {
                const commandConfig = (await import(`../interactions/commands/${folderName}/${fileName}`)).default;
                const command = new BotCommand({
                    ...commandConfig,
                    folder: folderName,
                    file: fileName
                });
                this.commands?.set(command.builder.name, command);
            });
        });
        // Events loader
        readdirSync('./src/events')
            .filter(file => file.endsWith('.js'))
            .forEach(async (fileName) => {
            const event = (await import(`../events/${fileName}`)).default;
            this[event.mode](event.name, (...args) => event.execute(...args));
        });
        // Buttons loader
        readdirSync('./src/interactions/buttons')
            .filter(file => file.endsWith('.js'))
            .forEach(async (fileName) => {
            const buttons = (await import(`../interactions/buttons/${fileName}`)).default;
            buttons.forEach(button => {
                this.buttons?.set(button.name, button);
            });
        });
        // Modals loader
        readdirSync('./src/interactions/modals')
            .filter(file => file.endsWith('.js'))
            .forEach(async (fileName) => {
            const modals = (await import(`../interactions/modals/${fileName}`)).default;
            modals.forEach(modal => {
                this.modals?.set(modal.name, modal);
            });
        });
        // Uncomment this for debugging purposes
        // this.on('debug', console.log)
    }
}
