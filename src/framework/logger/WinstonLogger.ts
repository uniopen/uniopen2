import * as Promise from 'bluebird';
import { existsSync } from 'fs';
import { inject, injectable } from 'inversify';
import { isEmpty } from 'lodash';
import { sync } from 'mkdirp';
import { join } from 'path';
import * as Winston from 'winston';

import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_STARTUP } from '../../inversify/_helper';
import { IConfigManager } from '../config/IConfigManager';
import { ILoggerManager } from './ILoggerManager';

@injectable()
export class WinstonLogger implements ILoggerManager {

    public static get DEBUG(): string {
        return 'debug';
    }

    public static get INFO(): string {
        return 'info';
    }

    public static get WARN(): string {
        return 'warn';
    }

    public static get ERROR(): string {
        return 'error';
    }

    private _logger: Winston.LoggerInstance;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager) { }

    @asyncInit(PRIORITY_STARTUP)
    public init(): Promise<void> {
        return Promise.try(() => {
            const dir = this.config.string('LOG_PATH');
            const file = this.config.string('LOG_FILE');
            const level = this.config.string('LOG_LEVEL');
            const path = join(__dirname, '../../../', dir);

            this.tryCreateLogDir(path);

            const options: Winston.LoggerOptions = {
                level, transports: [
                    new (Winston.transports.Console)(),
                    new (Winston.transports.File)({ filename: join(path, file) }),
                ],
            };

            this._logger = new Winston.Logger(options);
        });
    }

    private tryCreateLogDir(path: string): void {
        if (existsSync(path) === false) {
            sync(path);
        }
    }

    public log(level: string, msg: string, meta?: any): void {
        if (isEmpty(meta) === true) {
            this._logger.log(level, msg);
        } else {
            this._logger.log(level, msg, meta);
        }
    }

    public debug(msg: string, meta?: any): void {
        this.log(WinstonLogger.DEBUG, msg, meta);
    }

    public info(msg: string, meta?: any): void {
        this.log(WinstonLogger.INFO, msg, meta);
    }

    public warn(msg: string, ...meta: any[]): void {
        this.log(WinstonLogger.WARN, msg, meta);
    }

    public error(msg: string, meta?: any): void {
        this.log(WinstonLogger.ERROR, msg, meta);
    }

}
