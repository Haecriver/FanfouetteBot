import { Message, Snowflake } from "discord.js";
import ABotModules from "./ABotModule";
import BotParametersSingleton from "../singletons/BotParametersSingleton";

export default abstract class ACommandModule extends ABotModules {

    private regexStr: string = null;
    private commandMap: Map<string, (message: Message, args: string[]) => void> = new Map();
    private admins: Snowflake[] = [process.env.ADMIN_ID];

    constructor(private commandChar: string = '\\/') {
        super();
        this.regexStr = `^${this.commandChar}\\ ?((?:\\S*\\ )*\\S+)`;

        BotParametersSingleton.getInstance().onBotParametersUpdated((oldParameters, newParameters) => {
            this.admins = [process.env.ADMIN_ID, ...(newParameters.admins || [])];
        });
    }

    protected onNotBotMessage = (message: Message) => {
        // Is author an admin
        const adminMessage = this.admins.includes(message.author.id);


        // I dont want to compute the RegExp needlessy
        let match : string[] = null;
        if (adminMessage) {
            // Is message a command
            match = new RegExp(this.regexStr, 'g').exec(message.content);
        }

        if (match) {
            const command: string = match[1]; // We take the first group

            const [ commandKey, ...argv ] = command.split(/\s+/);

            const commandCallback = this.commandMap[commandKey];
            if (commandCallback){
                commandCallback(message, [...argv]);
            }
        } else if (this.onSimpleMessage) { // if not admin or not command
            this.onSimpleMessage(message);
        }
    }

    protected abstract onSimpleMessage: (message: Message) => void;

    protected addCommand(commandKey: string, callback: (message: Message, args: string[]) => void) {
        this.commandMap[commandKey] = callback;
    }
}