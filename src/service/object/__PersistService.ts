import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { RawDataDao } from '../../dao/RawDataDao';
import { UniDataDao } from '../../dao/UniDataDao';
import { IUniData } from '../../domain/IUniData';
import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { UuidHelper } from '../../framework/helper/UuidHelper';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';

@injectable()
export class OffPersistService implements IComponent {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('RawDataDao')) private rawData: RawDataDao,
        @inject(getSymbol('UniDataDao')) private uniData: UniDataDao,
        @inject(getSymbol('UuidHelper')) private uuid: UuidHelper,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => { });
    }

    public run(data: any): Promise<any> {
        return Promise.try(() => {
            console.log('PersistService >>>', data);
            return this.fetchRawData(data.key);
        }).then((raw: any) => {
            return this.insertUniData(raw);
        }).then((raw: any) => {
            return this.clearRawData(data.key);
        });
    }

    private clearRawData(key: string): Promise<any> {
        return this.rawData.deleteByKey(key);
    }

    private insertUniData(data: IUniData): Promise<any> {
        return this.uniData.save(data);
    }

    private fetchRawData(key: string): Promise<any> {
        return Promise.try(() => { });
    }

}
