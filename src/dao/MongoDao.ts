import { Db, MongoClient } from 'mongodb';
import Logger from '../logger/LoggerSingleton';
import IDao from './IDao';
import BotParameters from '../models/BotParameters';
import ICRUD from './CRUD/ICRUD';

export class MongoDao implements IDao {

    public constructor(private dbUri: string, private dbName: string) { }

    public operate(fn: (db: Db) => Promise<any>) : Promise<any> {
        let client: MongoClient = null;
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, _client) => {
                if (err) {
                    reject(err);
                }else {
                    resolve(_client)
                }
            });
        })
        .then((_client: MongoClient) => {
            client = _client;
            const db = client.db(this.dbName);
            return fn(db);
        })
        .finally(() => {
            if (client) {
                client.close();
            }
        });
    }

    private handleError =
        (resolve, reject) =>
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
                return new Promise((resolve, reject) => {
                    return db.collection('parameters').insertOne(newElement, this.handleError(resolve, reject))
                });
            });
        },
        read: () => {
            return this.operate((db) => {
                return new Promise((resolve, reject) => {
                    return db.collection('parameters').findOne({}, this.handleError(resolve, reject))
                });
            });
        },
        update: (element: BotParameters) => {
            return this.operate((db) => {
                return new Promise((resolve, reject) => {
                    return db.collection('parameters')
                        .updateOne({ _id: element._id }, { $set: element } , this.handleError(resolve, reject))
                });
            });
        },
        delete: (element: BotParameters) => {
            return this.operate((db) => {
                return new Promise((resolve, reject) => {
                    return db.collection('parameters').deleteOne(element, this.handleError(resolve, reject))
                });
            });
        },
    };
}