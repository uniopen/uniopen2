import { inject, injectable } from 'inversify';
import * as moment from 'moment';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';

@injectable()
export class DateHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    // TODO: aggiungere tutte i metodi che servono
    // usando per l'implementazione "momentjs"

    public millis(): number {
        return moment().valueOf();
    }

    public numberToMillis(value: number): number {
        return moment(value).valueOf();
    }

    public stringToMillis(value: string): number {
        return moment(value, 'x').valueOf();
    }

    public isBefore(d1: number, d2: number): boolean {
      return moment(d1).isBefore(moment(d2));
    }
}
