import * as Promise from 'bluebird';

export interface ICacheManager {
    initValue<T>(key: string, exec: () => Promise<T>): Promise<void>;
    getOrSet<T>(key: string, exec: () => Promise<T>, ttl: number): Promise<T>;
    setValue<T>(key: string, value: T, ttl?: number): Promise<void>;
    getValue<T>(key: string): Promise<T>;
}
