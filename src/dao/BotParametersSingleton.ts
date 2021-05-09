import DaoSingleton from "./DaoSingleton";
import BotParameters from "../models/BotParameters";
import Logger from "../logger/Logger";
import EventEmitter from "events";

const EVENT_PARAMETER_UPDATED = "botParametersUpdated";

export default class BotParametersSingleton {
    private botParameters: BotParameters = null;
    public getBotParameters: () => BotParameters = () => this.botParameters || new BotParameters();

    private static instance: BotParametersSingleton = null;
    public static getInstance = () => {
        if (!BotParametersSingleton.instance) {
            BotParametersSingleton.instance = new BotParametersSingleton();
        }
        return BotParametersSingleton.instance;
    }

    private constructor() {
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
                // We have fetched our parameters for the first time
                // Set param
                this.botParameters = botParameters;

                // Prepare the event to set the Channel when the client will be connected
                this.botParametersUpdateEmitter.emit(
                    EVENT_PARAMETER_UPDATED,
                    {},
                    this.botParameters
                );
            })
            .catch((reason) => Logger.error(reason));
    }

    public updateParameters = (newParameters: BotParameters) => {
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

    private botParametersUpdateEmitter: EventEmitter = new EventEmitter();
    public onBotParametersUpdated = (
        callback: (newParameters: BotParameters, oldParameters?: BotParameters) => void
    ) => {
        this.botParametersUpdateEmitter.addListener(EVENT_PARAMETER_UPDATED, callback);
    }

    public fireClientIsReady = () => {
        // When the client is connected we fire the event of parameters (in case we miss an initialization)
        // If there is no botParameters, this means the db has not been initialized yet
        if (this.botParameters) {
            this.botParametersUpdateEmitter.emit(
                EVENT_PARAMETER_UPDATED,
                this.botParameters,
                null
            );
        }
    }
}