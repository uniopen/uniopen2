import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { trimEnd, filter } from 'lodash';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { ServicesDb } from '../temp/services.db';
import { UniDataDao } from '../../dao/UniDataDao';
import { IUniData } from '../../domain/IUniData';

@injectable()
export class GetDataAction implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('UniDataDao')) private uniData: UniDataDao) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(input: any): Promise<any> {
        return Promise.try(() => {
            if (!input) {  return ServicesDb.supportedObj(); }
            let data = trimEnd(input, '/').split('/');
            if (data.length === 1) {
              return ServicesDb.supportedObj()
                .then((value: any) => value[data[0]] ? value[data[0]] : []);
            }
            return data.length > 2 ?
              this.uniData.getAllWith({ id : data[2] }, {_id: 0, key: 0})
              .then((vl) => vl.length ? vl[0].obj : [] )  :
              this.uniData.getAllWith({ uni : data[0], type: data[1] }, {_id: 0, key: 0});
        });
    }

}
