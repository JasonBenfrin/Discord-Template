export default class BotEvent {
    constructor(options) {
        this.name = options.name;
        this.execute = options.execute;
        this.mode = options.mode ?? 'on';
    }
}
