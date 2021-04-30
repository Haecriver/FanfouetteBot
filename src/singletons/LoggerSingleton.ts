import { Channel } from "discord.js";
import ConsoleLogger from "../logger/LoggerImplementations/ConsoleLogger";
import DiscordLogger from "../logger/LoggerImplementations/DiscordLogger";
import MultipleLogger from "../logger/LoggerImplementations/MultipleLogger";

export default class LoggerSingleton {
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