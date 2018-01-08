import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { merge } from 'lodash';
import { Collection, DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb';

import { IRawData } from '../domain/IRawData';
import { IConfigManager } from '../framework/config/IConfigManager';
import { Mongodb } from '../framework/driver/db/Mongodb';
import { IAsyncInit } from '../framework/interface/IAsyncInit';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_MEDIUM } from '../inversify/_helper';

@injectable()
export class RawDataDao implements IAsyncInit {

    private collection: Collection;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('Mongodb')) private mongodb: Mongodb) { }

    @asyncInit(PRIORITY_MEDIUM)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.collection = this.mongodb.collection('rawData');
            // return this.createIndex();
        });
    }

    public insertDraft(raw: IRawData): Promise<ObjectId> {
        return new Promise<ObjectId>((resolve, reject) => {
            let doc = merge(raw, { status: 'draft' });
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

    public commitDraftByKey(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.collection.updateMany({ key, status: 'draft' }, { $set: { status: 'committed' } })
                .then((result: UpdateWriteOpResult) => {
                    return resolve();
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public completeCommittedByKey(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.collection.updateMany({ key, status: 'committed' }, { $set: { status: 'completed' } })
                .then((result: UpdateWriteOpResult) => {
                    return resolve();
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

    public findById(id: ObjectId): Promise<IRawData> {
        return new Promise<IRawData>((resolve, reject) => {
            return this.collection.findOne({ _id: id })
                .then((doc: IRawData) => {
                    return resolve(doc);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public findCommittedByKey(key: string): Promise<IRawData[]> {
        return new Promise<IRawData[]>((resolve, reject) => {
            return this.collection.find({ key, status: 'committed' })
                .sort({ _id: 1 }).toArray()
                .then((docs: IRawData[]) => {
                    return resolve(docs);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

}
