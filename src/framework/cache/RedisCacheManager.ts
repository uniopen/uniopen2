import * as Promise from 'bluebird';
import { resolve } from 'bluebird';
import { inject, injectable } from 'inversify';
import { isObject, isString, isFinite, isUndefined, isNumber, isArray, isDate, isBoolean } from 'lodash';

import { Redis } from '../../framework/driver/db/Redis';
import { getSymbol } from '../../inversify/_helper';
import { IConfigManager } from '../config/IConfigManager';
import { ILoggerManager } from '../logger/ILoggerManager';
import { ICacheManager } from './ICacheManager';

@injectable()
export class RedisCacheManager implements ICacheManager {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('Redis')) private redis: Redis) { }

    public getOrSet<T>(key: string, exec: () => Promise<T>, ttl: number): Promise<T> {
        let result: T;
        return this.getValue(key)
            .then((one: T) => {
                result = one;
                if (this.isValid(one)) {
                    return resolve(undefined);
                }
                return exec();
            })
            .then((one: T) => {
                if (this.isValid(one)) {
                    result = one;
                    return this.setValue<T>(key, result, ttl);
                }
                return resolve();
            })
            .then((one: any) => {
                return resolve(result);
            });
    }

    public initValue<T>(key: string, exec: () => Promise<T>): Promise<void> {
        let result: T;
        return this.getValue(key)
            .then((one: T) => {
                result = one;
                console.log('initValue >>>', key, one);
                if (this.isValid(one)) {
                    return resolve(undefined);
                }
                return exec();
            })
            .then((one: T) => {
                console.log('initValue >>>', key, one);
                if (this.isValid(one)) {
                    result = one;
                    return this.setValue<T>(key, result);
                }
                return resolve();
            })
            .then((one: any) => {
                return resolve();
            });
    }

    public getValue<T>(key: string): Promise<T> {
        return this.redis.get(key)
            .then((one: string) => {
                if (isString(one)) {
                    return JSON.parse(one);
                }
            });
    }

    public setValue<T>(key: string, value: T, ttl?: number): Promise<void> {
        if (isFinite(ttl)) {
            return this.redis.set(key, JSON.stringify(value), 'EX', ttl);
        }
        return this.redis.set(key, JSON.stringify(value));
    }

    private isValid(one: any): boolean {
        return isObject(one) || isArray(one) || isDate(one)
            || isBoolean(one) || isString(one) || isNumber(one);
    }

}
