/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */
// tslint:disable: no-submodule-imports

// Import the discord.js module
import { Client } from 'discord.js';
import { catFile } from './tools/catFile';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Bot from './Bot';
import PingPongMondule from './modules/PingPongModule/PingPongModule';

const argv = yargs(hideBin(process.argv)).argv
const CONFIG = process.env || JSON.parse(catFile(argv.configJSONPath as string))

const dtoken: string = CONFIG.DISCORD_TOKEN;

if (!dtoken) {
    console.error('Fatal error : No token provided !')
    process.exit();
}

const activatedModules = [
    new PingPongMondule()
];

const bot: Bot = new Bot(dtoken, activatedModules);
