import { inject, injectable } from 'inversify';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';

const cheerio = require('cheerio');

@injectable()
export class HtmlHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public load(source: string): any {
        return cheerio.load(source);
    }

}
