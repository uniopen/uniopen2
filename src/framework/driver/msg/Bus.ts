import { inject, injectable } from 'inversify';

import { getSymbol } from '../../../inversify/_helper';
import { IConfigManager } from '../../config/IConfigManager';
import { ISubscription } from '../../interface/ISubscription';
import { ILoggerManager } from '../../logger/ILoggerManager';

const postal = require('postal');

@injectable()
export class Bus {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public subscribe(channel: string, topic: string, callback: (data: any, env?: any) => void): ISubscription {
        // console.log('pusubscribeblish >>>', channel, topic);
        return postal.subscribe({ channel, topic, callback });
    }

    public publish(channel: string, topic: string, data: any): void {
        // console.log('publish >>>', channel, topic, data);
        postal.publish({ channel, topic, data });
    }

}
