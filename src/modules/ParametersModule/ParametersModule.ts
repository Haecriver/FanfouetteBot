import { Channel, TextChannel, Message } from "discord.js";
import ACommandModule from "../ACommandModule";
import LoggerSingleton from "../../logger/LoggerSingleton";
import BotParametersSingleton from "../../dao/BotParametersSingleton";


export default class ParametersModuleSingleton extends ACommandModule {
    public constructor() {
        super();

        // Init all parameter settings commands
        this.initCommands();
    }

    private initCommands = () => {
        const parametersSingleton = BotParametersSingleton.getInstance();

        this.addCommand('setLogChannel', (message, [channelId]) => {
            if (channelId) {
                if (channelId === 'null') {
                    // update on db
                    parametersSingleton.updateParameters({
                        ...parametersSingleton.getBotParameters(), logChannelId: null
                    });

                    LoggerSingleton.setLogChannel(null);

                    message.channel.send("Log channel removed");
                } else {
                    this.client.channels.fetch(channelId)
                        .then((channel: Channel) => {
                            // update on db
                            parametersSingleton.updateParameters({
                                ...parametersSingleton.getBotParameters(), logChannelId: channelId
                            });

                            // Set log channel
                            LoggerSingleton.setLogChannel(channel);

                            // send a message
                            message.channel.send(`Log channel set to ${(channel as TextChannel).name}`);
                        })
                        .catch(() => {
                            message.channel.send("The given channel id is invalid");
                        });
                }
            } else {
                message.channel.send("You need to give a valid logChannelId");
            }
        });
    }

    // No implementation
    protected onSimpleMessage: (message: Message) => void = null;
}