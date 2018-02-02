import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { isUndefined } from 'lodash';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { FindAllAction } from '../rest/FindAllAction';
import { FullScanAction } from '../rest/FullScanAction';
import { GetDataAction } from '../rest/GetDataAction';

@injectable()
export class RestManager implements IComponent {

    private actions: { [key: string]: (args: any) => Promise<void> };

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('FindAllAction')) private findAll: FindAllAction,
        @inject(getSymbol('FullScanAction')) private fullScan: FullScanAction,
        @inject(getSymbol('GetDataAction')) private get: GetDataAction) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            return this.registerActions();
        });
    }

    public run(input: any): Promise<any> {
        return Promise.try(() => {
            return this.execute(input.action, input.body);
        });
    }

    private execute(action: string, body: any): Promise<void> {
        return Promise.try(() => {
            let callable = this.actions[action];
            if (isUndefined(callable)) {
                throw new Error('Invalid Action');
            }
            return callable.call(this, body);
        });
    }

    private registerActions(): Promise<void> {
        return Promise.try(() => {
            this.actions = {
                'full-scan': (args: any) => this.fullScan.run(args),
                'find-all': (args: any) => this.findAll.run(args),
                'get': (args: any) => this.get.run(args),
            };
        });
    }

}
