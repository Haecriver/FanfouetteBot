import { Message } from "discord.js";
import Logger from "../../logger/LoggerSingleton";
import ABotModules from "../ABotModule";
import ParametersModuleSingleton from "../ParametersModuleSingleton/ParametersModuleSingleton";

class PingPongMondule extends ABotModules {
    protected onNotBotMessage = (message: Message) => {
        // If the message is "ping"
        if (message.content === 'ping') {
            // Send "pong" to the same channel
            message.channel.send(
                `ping, check ${ParametersModuleSingleton.getInstance().getBotParameters().logChannelId}`,
            );
            Logger.log('ping');
        }
    };
}

export default PingPongMondule;