export class CommandConfig {
    builder;
    execute;
    guild;
    autocomplete;
    constructor(option) {
        this.builder = option.builder;
        this.execute = option.execute;
        this.guild = option.guild;
        this.autocomplete = option.autocomplete;
    }
}
export default class BotCommand extends CommandConfig {
    folder;
    file;
    id;
    constructor(option) {
        const { folder, file, ...superArgs } = option;
        super(superArgs);
        this.folder = folder;
        this.file = file;
    }
}
