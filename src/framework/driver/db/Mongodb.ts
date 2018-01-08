import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { Collection, Db, GridFSBucket, MongoClient, MongoClientOptions } from 'mongodb';
import { IConfigManager } from '../../../framework/config/IConfigManager';
import { IAsyncInit } from '../../../framework/interface/IAsyncInit';
import { ILoggerManager } from '../../../framework/logger/ILoggerManager';
import { asyncInit } from '../../../inversify/_decorator';
import { getSymbol, PRIORITY_HIGH } from '../../../inversify/_helper';

@injectable()
export class Mongodb implements IAsyncInit {

  private database: Db;

  public constructor(
    @inject(getSymbol('ConfigManager')) private config: IConfigManager,
    @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

  @asyncInit(PRIORITY_HIGH)
  public init(): Promise<void> {
    return Promise.try(() => {
      const host = this.config.string('MONGODB_HOST');
      const port = this.config.number('MONGODB_PORT');
      const db = this.config.string('MONGODB_DB');

      const url = `mongodb://${host}:${port}/${db}`;

      const opt: MongoClientOptions = {
        native_parser: true,
        w: 'majority',
        poolSize: 20,
        ssl: false,
      };

      this.log.debug(url);

      return this.connect(url, opt);
    });
  }

  public bucket(name: string): GridFSBucket {
    return new GridFSBucket(this.database, { bucketName: name });
  }

  public collection(name: string): Collection {
    return this.database.collection(name);
  }

  private connect(url: string, opt: MongoClientOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MongoClient.connect(url, opt)
        .then((database: Db) => {
          this.database = database;
          return resolve();
        })
        .catch((err: Error) => {
          console.error(err.message, err.stack);
          return reject();
        });
    });
  }

}
