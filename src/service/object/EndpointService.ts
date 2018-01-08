import { IAsyncInit } from '../../framework/interface/IAsyncInit';
import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { map } from 'lodash';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { ServicesDb } from '../temp/services.db';

@injectable()
export class EndpointService implements IAsyncInit {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public extract(data: any): Promise<any> {
        return Promise.try(() => {
            console.log('EndpointService >>>', data);
            return this.fetchUrls(data.uni, data.type);
        }).then((urls: any[]) => {
            return Promise.all(this.promises(urls));
        });
    }

    private promises(urls: any[]): Array<Promise<any>> {
        return map(urls, (url: any) => {
            return this.next(url);
        });
    }

    private fetchUrls(uni: string, type: string): Promise<any[]> {
        return Promise.try(() => {
            return ServicesDb.findUrls(uni, type);
        });
    }

    private next(data: any): Promise<void> {
        return Promise.try(() => {
            return this.bus.publish('uniobj', 'grab-data', data);
        });
    }

}
