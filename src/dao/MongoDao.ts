import { Db, MongoClient } from 'mongodb';
import Logger from '../logger/LoggerSingleton';
import IDao from './IDao';
import BotParameters from '../models/BotParameters';
import ICRUD from './CRUD/ICRUD';

export class MongoDao implements IDao {

    public constructor(private dbUri: string, private dbName: string) { }

    public async operate(fn: (db: Db) => Promise<any>) : Promise<any> {
        let client: MongoClient;

        try{
            client = await MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db(this.dbName);
            const results = await fn(db);
            return Promise.resolve(results);
        }
        catch (e){
            Logger.error(e);
            return Promise.reject(e);
        } finally{
            if (client) {
                client.close();
            }
        }
    }

    private handleError = (reject, resolve) =>
        (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        };

    public botParametersCRUD: ICRUD<BotParameters> = {
        create: (newElement: BotParameters) => {
            return this.operate((db) => {
                return new Promise((resolve, reject) =>
                    db.collection('parameters').insertOne(newElement, this.handleError(resolve, reject))
                )
            });
        },
        read: () => {
            return this.operate((db) => {
                return new Promise((resolve, reject) =>
                    db.collection('parameters').findOne({}, this.handleError(resolve, reject))
                );
            });
        },
        update: (element: BotParameters) => {
            return this.operate((db) => {
                return new Promise((resolve, reject) =>
                    db.collection('parameters').updateOne({}, element, this.handleError(resolve, reject))
                );
            });
        },
        delete: (element: BotParameters) => {
            return this.operate((db) => {
                return new Promise((resolve, reject) =>
                    db.collection('parameters').deleteOne(element, this.handleError(resolve, reject))
                );
            });
        },
    };
}