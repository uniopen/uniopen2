import * as Promise from 'bluebird';
import { injectable } from 'inversify';
import { clone, toNumber, toString } from 'lodash';

import { asyncInit } from '../../inversify/_decorator';
import { PRIORITY_STARTUP } from '../../inversify/_helper';
import { IConfigManager } from './IConfigManager';

@injectable()
export class ConfigManager implements IConfigManager {

    private data: { [k: string]: string | undefined };

    public constructor() { }

    @asyncInit(PRIORITY_STARTUP)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.data = clone(process.env);
        });
    }

    public value(key: string): any {
        return this.data[key];
    }

    public string(key: string): string {
        return toString(this.value(key));
    }

    public number(key: string): number {
        return toNumber(this.value(key));
    }

}
