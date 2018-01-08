import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../framework/config/IConfigManager';
import { Redis } from '../framework/driver/db/Redis';
import { IComponent } from '../framework/interface/IComponent';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../inversify/_helper';
import { ObjectManager } from '../service/manager/ObjectManager';

@injectable()
export class RedisAdapter implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('ObjectManager')) private obj: ObjectManager,
        @inject(getSymbol('Redis')) private redis: Redis) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(): Promise<void> {
        return Promise.try(() => {
            // return this.startListeners();
        });
    }

    /*
    private startListeners(): Promise<void> {
        return Promise.try(() => {
            return this.polling();
        });
    }

    // TODO: DRAFT =>
    // 1. consumare prima la coda privata
    // 2. la cancellazione del messaggi elaborati
    // 3. multi istanza con code private diverse
    private polling(): Promise<void> {
        return Promise.try(() => {
            return Promise.delay(500);
        }).then(() => {
            return this.retrieve();
        }).then((data: any) => {
            if (!isEmpty(data)) {
                return this.execute(data);
            }
        }).finally(() => {
            return this.polling();
        });
    }

    private retrieve(): Promise<any> {
        // console.log('retrieve >>>');

        return new Promise<any>((resolve, reject) => {
            let common = this.redis.common();
            let working = this.redis.working();

            return this.redis
                .brpoplpush(common, working)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: Error) => {
                    return reject(err);
                });
        });
    }

    private execute(data: any): Promise<void> {
        this.log.info('RedisAdapter::execute >>>', data);

        return Promise
            .try(() => {
                return this.adapt(data);
            })
            .then((item: any) => {
                return this.uni.run(item);
            })
            .catch((err: Error) => {
                if (err.message !== 'INVALID_MESSAGE') {
                    console.error(err.message, err.stack);
                }
            })
            .return();
    }

    private adapt(data: any): Promise<any> {
        return Promise.try(() => {
            return JSON.parse(data) as any;
        });
    }*/

}
