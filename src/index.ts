/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */
// tslint:disable: no-submodule-imports

// Import the discord.js module
import { Client } from 'discord.js';
import { catFile } from './tools/catFile';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv

const dtoken: string = argv.token as string || catFile(argv.tokenFile as string);

if (!dtoken) {
    console.error('Fatal error : No token provided !')
    process.exit();
}

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    // tslint:disable-next-line no-console
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});

try {
    // Log our bot in using the token from https://discord.com/developers/applications
    client.login(dtoken);
} catch (error) {
    console.error(error);
    process.exit();
}
