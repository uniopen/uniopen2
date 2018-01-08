import { inject, injectable } from 'inversify';
import { v1, v4 } from 'uuid';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';

@injectable()
export class UuidHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public v1(): string {
        return v1();
    }

    public v4(): string {
        return v4();
    }

}
