import Bot from './Bot';
import PingPongMondule from './modules/PingPongModule/PingPongModule';
import BotParameters from './models/BotParameters';
import MultipleLogger from './logger/LoggerImplementations/MultipleLogger';
import ConsoleLogger from './logger/LoggerImplementations/ConsoleLogger';
import DiscordLogger from './logger/LoggerImplementations/DiscordLogger';
import { LoggerSingleton } from './logger/LoggerSingleton';
import Dao from './dao/Dao';
import EDaoType from './dao/EDaoType';

// Init me token
const CONFIG = process.env
const dtoken: string = CONFIG.DISCORD_TOKEN;

if (!dtoken) {
    console.error('Fatal error : No token provided !')
    process.exit();
}

// Init me module list
const activatedModules = [
    new PingPongMondule()
];

// Init me DAO to get me parameters
const parameters = new BotParameters();

// Init DAO
Dao.initDao(EDaoType.Mongo, process.env.DATABASE_URI, process.env.DATABASE_NAME);

// Init parameters
LoggerSingleton.setParameters(parameters);

// Init ZE bot
const bot: Bot = new Bot(dtoken, activatedModules, parameters);
