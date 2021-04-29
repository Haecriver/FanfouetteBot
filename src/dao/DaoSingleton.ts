import { MongoDao } from "./MongoDao";
import IDao from "./IDao";
import EDaoType from "./EDaoType";
import Logger from "../logger/LoggerSingleton";

export default class DaoSingleton {

    private static instance : IDao = null;

    private constructor() { }

    public static initDao(type: EDaoType, ...args: any[]) {
        switch (type) {
            case EDaoType.Mongo:
                if (args && args.length === 2 && args[0] && args[1]) {
                    DaoSingleton.instance = new MongoDao(args[0], args[1]);
                }
                else {
                    Logger.error('Not enough arguments for for instanciating a MongoDao!');
                }
                break;

            default:
                break;
        }
    }

    public static getInstance() : IDao {
        return DaoSingleton.instance;
    }
}