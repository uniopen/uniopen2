import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';

@injectable()
export class ObjectManager implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(item: any): Promise<any> {
        return Promise.try(() => { });
    }

}
