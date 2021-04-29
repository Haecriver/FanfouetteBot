import { Channel, TextChannel, Message } from "discord.js";
import { EventEmitter } from "events";
import DaoSingleton from "../../dao/DaoSingleton";
import Logger, { LoggerSingleton } from "../../logger/LoggerSingleton";
import BotParameters from "../../models/BotParameters";
import ACommandModule from "../ACommandModule";

const EVENT_PARAMETER_UPDATED = "botParametersUpdated";

export default class ParametersModuleSingleton extends ACommandModule {
    private static instance: ParametersModuleSingleton = null;
    public static getInstance = () => {
        if (!ParametersModuleSingleton.instance) {
            ParametersModuleSingleton.instance = new ParametersModuleSingleton();
        }
        return ParametersModuleSingleton.instance;
    }

    private botParameters: BotParameters = null;
    public getBotParameters = () => this.botParameters;

    private constructor() {
        super();
        const dao = DaoSingleton.getInstance();

        dao.botParametersCRUD.read()
            .then((botParameters: BotParameters) => {
                // It exists
                if (botParameters) {
                    return botParameters;
                } else {
                    // It does not exist
                    const newBotParameters = new BotParameters();
                    return dao.botParametersCRUD
                        .create(newBotParameters)
                        .then(() => newBotParameters);
                }
            })
            .then((botParameters: BotParameters) => {
                // Set param
                this.botParameters = botParameters;

                // Prepare the event to set the Channel when the client will be connected
                this.onClientReady(() => {
                    // Set log channel we can
                    if (this.botParameters.logChannelId) {
                        this.client.channels.fetch(this.botParameters.logChannelId)
                            .then((channel) => {
                                LoggerSingleton.setLogChannel(channel);
                            })
                            .catch((reason) => {
                                Logger.error(reason);
                            });
                    }
                });

                // Init all parameter settings commands
                this.initCommands();
            })
            .catch((reason) => Logger.error(reason));
    }

    private botParametersUpdateEmitter: EventEmitter = new EventEmitter();

    private updateParameters = (newParameters: BotParameters) => {
        const oldParameters = { ...this.botParameters };
        // update attribute
        this.botParameters = newParameters;

        // Update in db
        DaoSingleton.getInstance().botParametersCRUD.update(this.botParameters)
            .catch((reason) => {
                Logger.error(reason);
            });

        // shoot event
        this.botParametersUpdateEmitter.emit(
            EVENT_PARAMETER_UPDATED,
            oldParameters,
            this.botParameters
        );
    }

    private initCommands = () => {
        this.addCommand('setLogChannel', (message, [channelId]) => {
            if (channelId) {
                if (channelId === 'null') {
                    // update on db
                    this.updateParameters({ ...this.botParameters, logChannelId: null });

                    LoggerSingleton.setLogChannel(null);

                    message.channel.send("Log channel removed");
                } else {
                    this.client.channels.fetch(channelId)
                        .then((channel: Channel) => {
                            // update on db
                            this.updateParameters({ ...this.botParameters, logChannelId: channelId });

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

    public onBotParametersUpdated = (
        callback: (oldParameters: BotParameters, newParameters: BotParameters) => void
    ) => {
        this.botParametersUpdateEmitter.addListener(EVENT_PARAMETER_UPDATED, callback);
    }
}