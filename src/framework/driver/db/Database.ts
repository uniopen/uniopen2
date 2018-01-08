import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as Knex from 'knex';

import { asyncInit } from '../../../inversify/_decorator';
import { getSymbol, PRIORITY_HIGH } from '../../../inversify/_helper';
import { IConfigManager } from '../../config/IConfigManager';
import { IAsyncInit } from '../../interface/IAsyncInit';
import { ILoggerManager } from '../../logger/ILoggerManager';

@injectable()
export class Database implements IAsyncInit {

    private database: Knex;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_HIGH)
    public init(): Promise<void> {
        return Promise.try(() => {
            const client = this.config.string('DB_CLIENT');
            const host = this.config.string('DB_HOST');
            const port = this.config.number('DB_PORT');
            const user = this.config.string('DB_USER');
            const password = this.config.string('DB_PASSWORD');
            const database = this.config.string('DB_DATABASE');

            const pool = { min: 0, max: 20 } as Knex.PoolConfig;
            const connection = { host, port, database, user, password } as Knex.ConnectionConfig;
            const config = { client, connection, pool, debug: false } as Knex.Config;

            this.database = Knex(config);
        });
    }

    public connection(): Knex {
        return this.database;
    }

    public migrator(): Knex.Migrator {
        return this.connection().migrate;
    }

    public close(): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.connection().destroy()
                .then(() => {
                    return resolve();
                })
                .catch((err: Error) => {
                    return reject(err);
                });
        });
    }

}
