export default class BotButton {
    name;
    execute;
    constructor(options) {
        this.name = options.name;
        this.execute = options.execute;
    }
}
