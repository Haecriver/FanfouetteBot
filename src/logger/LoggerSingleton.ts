import { Channel } from "discord.js";
import BotParameters from "../models/BotParameters";
import ConsoleLogger from "./LoggerImplementations/ConsoleLogger";
import DiscordLogger from "./LoggerImplementations/DiscordLogger";
import MultipleLogger from "./LoggerImplementations/MultipleLogger";

export class LoggerSingleton {
    private constructor() {};
    private static instance = null;

    private static createMultipleLoggerInstance(channel?: Channel) {
        const loggerList = [new ConsoleLogger()];
        if (channel) {
            loggerList.push(new DiscordLogger(channel));
        }
        return new MultipleLogger(loggerList);
    }

    public static setLogChannel(channel: Channel)  {
        LoggerSingleton.instance = LoggerSingleton.createMultipleLoggerInstance(channel);
    }

    public static getInstance() {
        if (!LoggerSingleton.instance) {
            LoggerSingleton.instance = LoggerSingleton.createMultipleLoggerInstance();
        }
        return LoggerSingleton.instance;
    }
}

const Logger = {
    log: (msg: string) => LoggerSingleton.getInstance().log(msg),
    info: (msg: string) => LoggerSingleton.getInstance().info(msg),
    error: (msg: string) => LoggerSingleton.getInstance().error(msg),
    warn: (msg: string) => LoggerSingleton.getInstance().warn(msg),
};

export default Logger;