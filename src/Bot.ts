// tslint:disable: no-submodule-imports

// Import the discord.js module
import { Client } from 'discord.js';
import { catFile } from './tools/catFile';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import IBotModules from './modules/IBotModule';

class Bot {
    // Create an instance of a Discord client
    public client: Client = new Client();

    public modules: IBotModules[] = [];

    private subscribeToEvents() {
        /**
         * The ready event is vital, it means that only _after_ this will your bot start reacting to information
         * received from Discord
         */
        this.client.on('ready', () => {
            // tslint:disable-next-line no-console
            console.log('I am ready!');
        });

        // Create an event listener for messages
        this.client.on('message', message => {
            this.modules.forEach((module) => module.onMessage(message));
        });
    }

    public constructor(token: string, modules: IBotModules[]) {
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
}

export default Bot;