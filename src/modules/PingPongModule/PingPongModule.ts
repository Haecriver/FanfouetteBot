import { Message } from "discord.js";
import IBotModules from "../IBotModule";

class PingPongMondule implements IBotModules {
    public onMessage = (message: Message) => {
        // If the message is "ping"
        if (message.content === 'ping') {
            // Send "pong" to the same channel
            message.channel.send('poooing');
        }
    };
}

export default PingPongMondule;