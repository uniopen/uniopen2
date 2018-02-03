import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { map, merge } from 'lodash';
import { trimEnd, filter } from 'lodash';


import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { ServicesDb } from '../temp/services.db';

@injectable()
export class GrabberScanAction implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(input: any): Promise<any> {
        return Promise.try(() => {
            //return ServicesDb.objects();
            if (!input) {  return ServicesDb.objects(); }   //No specific input, return full scan
            let data: any[] = trimEnd(input, '/').split('/');
            console.log("\n\n###\nGrabberScanAction\n" + data + "\n\n");
            return ServicesDb.objects_filter(data);     //return filtered grabbers' list
        }).then((objects: any[]) => {
            return this.next(objects);
        });
    }

    private next(all: any[]): Promise<any> {
        return Promise.try(() => {
            return Promise.all(this.promises(all));
        }).return({ done: true, data: 'submitted' });
    }

    private promises(all: any[]): any[] {
        return map(all, (data: any) => {
            console.log('full-scan', data);
            return this.bus.publish('uniobj', 'extract-urls', data);
        });
    }

}
