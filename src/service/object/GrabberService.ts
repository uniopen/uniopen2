import * as Promise from 'bluebird';
import { readFile } from 'fs';
import { inject, injectable } from 'inversify';
import { toString } from 'lodash';
import { join } from 'path';

import { RawDataDao } from '../../dao/RawDataDao';
import { UniDataDao } from '../../dao/UniDataDao';
import { IRawData } from '../../domain/IRawData';
import { IUniMsg } from '../../domain/IUniMsg';
import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { ScriptHelper } from '../../framework/helper/ScriptHelper';
import { IAsyncInit } from '../../framework/interface/IAsyncInit';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';

@injectable()
export class GrabberService implements IAsyncInit {

    private base: string;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('ScriptHelper')) private script: ScriptHelper,
        @inject(getSymbol('RawDataDao')) private rawData: RawDataDao,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.base = this.config.string('SCRIPT_PATH');
        });
    }

    public runScript(msg: IUniMsg): Promise<any> {
        return Promise.try(() => {
            // let data = { uni, type, code, url, key, raw };
            console.log('GrabberService >>>', msg.uni, msg.type, msg.code);
            return this.fetchScript(msg);
        }).then((script: string) => {
            return this.grabData(msg, script);
        });

        // return Promise.all(this.persistAndNextPromises(raws));
    }

    public partialData(msg: IUniMsg): Promise<any> {
        return this.rawData.insertDraft(this.buildRaw(msg));
    }

    public commitData(msg: IUniMsg): Promise<any> {
        let raw = this.buildRaw(msg);
        return this.rawData.insertDraft(raw).then(() => {
            return this.rawData.commitDraftByKey(raw.key);
        }).then(() => {
            return this.bus.publish('uniobj', 'digest-raw', {
                uni: raw.uni, type: raw.type, key: raw.key,
            });
        });
    }

    private buildRaw(msg: IUniMsg): IRawData {
        return {
            uni: toString(msg.uni),
            type: toString(msg.type),
            key: toString(msg.key),
            raw: msg.raw,
        };
    }

    private grabData(msg: IUniMsg, script: string): Promise<any> {
        return Promise.try(() => this.script.run(script, msg));
    }

    private fetchScript(msg: IUniMsg): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let path = this.path(msg.uni, msg.type, msg.code);
            return readFile(path, 'utf8', (err: Error, data: string) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    private path(uni: string, type: string, code: string): string {
        return join(__dirname, '../../..', this.base, uni, type, `${code}.js`);
    }

}
