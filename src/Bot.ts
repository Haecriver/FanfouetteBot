import { Client } from 'discord.js';
import IBotModules from './modules/IBotModule';
import BotParameters from './models/BotParameters';
import Logger from './logger/LoggerSingleton';

class Bot {
    // Create an instance of a Discord client
    private client: Client = new Client();

    public constructor(token: string, public modules: IBotModules[], public parameters: BotParameters) {
        this.modules = [...modules];
        this.subscribeToEvents();

        try {
            // Log our bot in using the token from https://discord.com/developers/applications
            this.client.login(token);
        } catch (error) {
            console.error(error);
            process.exit();
        }
    }

    private subscribeToEvents() {
        /**
         * The ready event is vital, it means that only _after_ this will your bot start reacting to information
         * received from Discord
         */
        this.client.on('ready', () => {
            // tslint:disable-next-line no-console
            Logger.log('Salut !');
        });

        // Create an event listener for messages
        this.client.on('message', message => {
            this.modules.forEach((module) => module.onMessage(message));
        });

        this.client.on('disconnect', () => {
            Logger.log('Adieu !');
        })
    }
}

export default Bot;