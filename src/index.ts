import Bot from './Bot';
import PingPongMondule from './modules/PingPongModule/PingPongModule';
import BotParameters from './models/BotParameters';
import MultipleLogger from './logger/LoggerImplementations/MultipleLogger';
import ConsoleLogger from './logger/LoggerImplementations/ConsoleLogger';
import DiscordLogger from './logger/LoggerImplementations/DiscordLogger';
import { LoggerSingleton } from './logger/LoggerSingleton';
import DaoSingleton from './dao/DaoSingleton';
import EDaoType from './dao/EDaoType';
import ParametersModuleSingleton from './modules/ParametersModuleSingleton/ParametersModuleSingleton';

// Init me token
const CONFIG = process.env
const dtoken: string = CONFIG.DISCORD_TOKEN;

if (!dtoken) {
    console.error('Fatal error : No token provided !')
    process.exit();
}

// Init DAO
DaoSingleton.initDao(EDaoType.Mongo, process.env.DATABASE_URI, process.env.DATABASE_NAME);

// Init me module list
const activatedModules = [
    new PingPongMondule(),
    ParametersModuleSingleton.getInstance(),
];

// Init ZE bot
const bot: Bot = new Bot(dtoken, activatedModules);
