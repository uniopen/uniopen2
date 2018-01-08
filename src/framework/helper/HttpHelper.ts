import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import fetch, { RequestInit, Response } from 'node-fetch';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';

@injectable()
export class HttpHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public get(uri: string, headers?: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            fetch(uri, this.options('get', headers))
                .then((res: Response) => {
                    return resolve(res);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    public post(uri: string, body?: any, headers?: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            fetch(uri, this.options('post', body, headers))
                .then((res: Response) => {
                    return resolve(res);
                })
                .catch((err: Error) => {
                    console.error(err.message, err.stack);
                    return reject(err);
                });
        });
    }

    // https://github.com/bitinn/node-fetch#fetch-options
    private options(method: string, body?: any, headers?: any): RequestInit {
        return { method, body, headers, timeout: 15000, follow: 10 };
    }

}
