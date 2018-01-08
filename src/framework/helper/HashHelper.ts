import * as hasha from 'hasha';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';

@injectable()
export class HashHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public hash(value: string): string {
        return hasha(value, { algorithm: 'sha512' });
    }

    public sha1(value: string): string {
        return hasha(value, { algorithm: 'sha1' });
    }

    public md5(value: string): string {
        return hasha(value, { algorithm: 'md5' });
    }

}
