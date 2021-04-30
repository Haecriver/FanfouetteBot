import { Message } from "discord.js";
import Logger from "../../logger/Logger";
import ABotModules from "../ABotModule";
import ACommandModule from "../ACommandModule";
import BotParametersSingleton from "../../singletons/BotParametersSingleton";

class PingPongMondule extends ACommandModule {
    protected onSimpleMessage: (message: Message) => void = null;

    public constructor(){
        super();
        this.addCommand('ping', (message) => {
            // Send "pong" to the same channel
            message.channel.send('pong');
            Logger.log(`ping, check ${BotParametersSingleton.getInstance().getBotParameters().logChannelId}`);
        });
    }
}

export default PingPongMondule;