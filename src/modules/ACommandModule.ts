import { Message } from "discord.js";
import Logger from "../logger/LoggerSingleton";
import ABotModules from "./ABotModule";

export default abstract class ACommandModule extends ABotModules {

    private regexStr: string = null;
    private commandMap: Map<string, (message: Message, args: string[]) => void> = new Map();

    constructor(private commandChar: string = '\\/') {
        super();
        this.regexStr = `^${this.commandChar}\\ ?((?:\\w*\\ )*\\w+)`;
    }

    protected onNotBotMessage = (message: Message) => {
        const match = new RegExp(this.regexStr, 'g').exec(message.cleanContent);
        if (match) {
            const command: string = match[1]; // We take the first group
            const [ commandKey, ...argv ] = command.split(/\s+/);

            const commandCallback = this.commandMap[commandKey];
            if (commandCallback){
                commandCallback(message, [...argv]);
            } else {
                Logger.error(`${commandKey} command does not exist !`);
            }
        } else if (this.onSimpleMessage) {
            this.onSimpleMessage(message);
        }
    }

    protected abstract onSimpleMessage: (message: Message) => void;

    protected addCommand(commandKey: string, callback: (message: Message, args: string[]) => void) {
        this.commandMap[commandKey] = callback;
    }
}