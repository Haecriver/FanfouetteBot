import Bot from './Bot';
import PingPongMondule from './modules/PingPongModule/PingPongModule';
import DaoSingleton from './dao/DaoSingleton';
import EDaoType from './dao/EDaoType';
import ParametersModule from './modules/ParametersModule/ParametersModule';
import BullyModule from './modules/BullyModule/BullyModule';
import AdventureModule from './modules/AdventureModule/AdventureModule';

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
    new ParametersModule(),
    new BullyModule(),
    new AdventureModule(),
];

// Init ZE bot
const bot: Bot = new Bot(dtoken, activatedModules);
