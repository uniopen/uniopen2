import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { HttpHelper } from '../../framework/helper/HttpHelper';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';

@injectable()
export class OffCrawlerService implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('HttpHelper')) private http: HttpHelper,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(data: any): Promise<any> {
        return Promise.try(() => {
            console.log('CrawlerService >>>', data);
            return this.fetchSource(data.uni, data.type, data.url);
        }).then((source: any) => {
            return this.next(source);
        });
    }

    private fetchSource(uni: string, type: string, url: string): Promise<any> {
        return Promise.try(() => {
            return this.http.get(url);
        }).then((source: string) => {
            return { uni, type, url, source };
        });
    }

    private next(data: any): Promise<void> {
        return Promise.try(() => {
            return this.bus.publish('uniobj', 'parse-source', data);
        });
    }

}
