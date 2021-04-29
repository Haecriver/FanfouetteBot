import { Client, Message } from "discord.js";

abstract class ABotModules {
    protected client: Client = null;
    public init = (client: Client) => {
        this.client = client;
    }

    protected onClientReady = (callback: () => void) => {
        this.client.on('ready', callback);
    }

    public onMessage = (message: Message) => {
        // If the author is not the bot
        if (this.client.user.id !== message.author.id) {
            this.onNotBotMessage(message);
        }
    }

    protected onNotBotMessage: (message: Message) => void
}

export default ABotModules;