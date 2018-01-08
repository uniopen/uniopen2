import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as IORedis from 'ioredis';

import { IConfigManager } from '../../../framework/config/IConfigManager';
import { IAsyncInit } from '../../../framework/interface/IAsyncInit';
import { ILoggerManager } from '../../../framework/logger/ILoggerManager';
import { asyncInit } from '../../../inversify/_decorator';
import { getSymbol, PRIORITY_HIGH } from '../../../inversify/_helper';

@injectable()
export class Redis implements IAsyncInit {

    private database: IORedis.Redis;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_HIGH)
    public init(): Promise<void> {
        return Promise.try(() => {
            const port = this.config.number('REDIS_PORT');
            const host = this.config.string('REDIS_HOST');
            const url = `redis://${host}:${port}`;
            this.database = new IORedis(url, { lazyConnect: true });
            return this.database.connect();
        });
    }

    public common(): string {
        return 'uniwhere:ambrogio:flow';
    }

    public working(): string {
        // TODO: ogni worker deve avere la sua coda privata
        return 'uniwhere:ambrogio:working';
    }

    public disconnect(): Promise<void> {
        return Promise.try(() => {
            this.database.disconnect();
        });
    }

    public set(...args: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.database.set(args)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: Error) => {
                    this.log.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public get(key: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            return this.database.get(key)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: Error) => {
                    this.log.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public del(key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            return this.database.del(key)
                .then(() => {
                    return resolve();
                })
                .catch((err: Error) => {
                    this.log.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public expire(key: string, seconds: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            return this.database.expire(key, seconds)
                .then(() => {
                    return resolve();
                })
                .catch((err: Error) => {
                    this.log.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public ttl(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.ttl(key)
                .then((data: any) => {
                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public exists(key: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            return this.database.exists(key)
                .then((result: number) => {
                    return resolve(result);
                })
                .catch((err: Error) => {
                    this.log.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public lpush(list: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.lpush(list, value)
                .then((data: any) => {
                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public rpush(list: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.rpush(list, value)
                .then((data: any) => {
                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public lpop(list: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.lpop(list)
                .then((data: any) => {
                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public rpop(list: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.rpop(list)
                .then((data: any) => {
                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public rpoplpush(source: string, destination: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.rpoplpush(source, destination)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: any) => {
                    return reject(err);
                });
        });
    }

    public brpoplpush(source: string, destination: string, timeout: number = 25): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.brpoplpush(source, destination, timeout)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: any) => {
                    return reject(err);
                });
        });
    }

    public lrange(list: string, start: number, stop: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.lrange(list, start, stop)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: any) => {
                    return reject(err);
                });
        });
    }

    public lrem(list: string, count: number, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.lrem(list, count, data)
                .then((data: any) => {
                    return resolve(data);
                })
                .catch((err: any) => {
                    return reject(err);
                });
        });
    }

    public getDB(): IORedis.Redis {
        return this.database;
    }

}
