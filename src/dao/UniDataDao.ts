import { IUniData } from '../domain/IUniData';
import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify'; import { Collection,
DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject,
InsertOneWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb';

import { IConfigManager } from '../framework/config/IConfigManager';
import { Mongodb } from '../framework/driver/db/Mongodb';
import { IAsyncInit } from '../framework/interface/IAsyncInit';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_MEDIUM } from '../inversify/_helper';

@injectable()
export class UniDataDao implements IAsyncInit {

    private collection: Collection;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('Mongodb')) private mongodb: Mongodb) { }

    @asyncInit(PRIORITY_MEDIUM)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.collection = this.mongodb.collection('uniData');
            // return this.createIndex();
        });
    }

    public save(doc: IUniData): Promise<IUniData> {
        return new Promise<IUniData>((resolve, reject) => {
            return this.collection.findOneAndUpdate({ key: doc.key }, doc, { upsert: true })
                .then((result: FindAndModifyWriteOpResultObject) => {
                    return this.findByKey(doc.key);
                })
                .then((doc: IUniData) => {
                    return resolve(doc);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public insert(doc: IUniData): Promise<ObjectId> {
        return new Promise<ObjectId>((resolve, reject) => {
            return this.collection.insertOne(doc)
                .then((result: InsertOneWriteOpResult) => {
                    return resolve(result.insertedId);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public update(doc: IUniData): Promise<ObjectId> {
        return new Promise<ObjectId>((resolve, reject) => {
            return this.collection.updateOne({ _id: doc._id }, doc)
                .then((result: UpdateWriteOpResult) => {
                    return resolve(doc._id);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public deleteById(id: ObjectId): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            return this.collection.deleteOne({ _id: id })
                .then((result: DeleteWriteOpResultObject) => {
                    return resolve();
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public deleteByKey(key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            return this.collection.deleteMany({ key })
                .then((result: DeleteWriteOpResultObject) => {
                    return resolve();
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public findById(id: ObjectId): Promise<IUniData> {
        return new Promise<IUniData>((resolve, reject) => {
            return this.collection.findOne({ _id: id })
                .then((doc: IUniData) => {
                    return resolve(doc);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public findByKey(key: string): Promise<IUniData> {
        return new Promise<IUniData>((resolve, reject) => {
            return this.collection.findOne({ key })
                .then((doc: IUniData) => {
                    return resolve(doc);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public getAllWith(values: any, filter = {}): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.collection.find(values, filter).toArray((err, result) => {
              if (err) { reject(err); }
              resolve(result);
            });
        });
    }

}
