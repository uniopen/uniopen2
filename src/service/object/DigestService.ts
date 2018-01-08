import { IAsyncInit } from '../../framework/interface/IAsyncInit';
import { UniDataDao } from '../../dao/UniDataDao';
import { IUniData } from '../../domain/IUniData';
import { IRawData } from '../../domain/IRawData';
import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { isUndefined, merge, omit, reduce, head, isObject } from 'lodash';

import { RawDataDao } from '../../dao/RawDataDao';
import { IConfigManager } from '../../framework/config/IConfigManager';
import { Bus } from '../../framework/driver/msg/Bus';
import { SchemaHelper } from '../../framework/helper/SchemaHelper';
import { UuidHelper } from '../../framework/helper/UuidHelper';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { BiblioSchemaBuilder } from '../schema/builder/BiblioSchemaBuilder';
import { MensaSchemaBuilder } from '../schema/builder/MensaSchemaBuilder';
import { StudioSchemaBuilder } from '../schema/builder/StudioSchemaBuilder';
import { UniSchema } from '../schema/UniSchema';

@injectable()
export class DigestService implements IAsyncInit {

    private schemas: { [key: string]: () => Promise<UniSchema> };

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('SchemaHelper')) private schema: SchemaHelper,
        @inject(getSymbol('RawDataDao')) private rawData: RawDataDao,
        @inject(getSymbol('UniDataDao')) private uniData: UniDataDao,
        @inject(getSymbol('UuidHelper')) private uuid: UuidHelper,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.schemas = {
                biblio: () => Promise.try(() => new BiblioSchemaBuilder().build()),
                studio: () => Promise.try(() => new StudioSchemaBuilder().build()),
                mensa: () => Promise.try(() => new MensaSchemaBuilder().build()),
            };
        });
    }

    public validate(data: any): Promise<any> {
        return Promise.try(() => {
            console.log('DigestService - run >>>', data);
            return this.aggregateRaw(data.key);
        }).then((obj: IUniData) => {
            console.log('DigestService - validateObj >>>', obj);
            return this.validateObj(obj);
        }).then((obj: IUniData) => {
            console.log('DigestService - persistObject >>>', obj);
            return this.persistObject(obj);
        }).catch((err: Error) => {
            console.log(err.message, data);
        });
    }

    private aggregateRaw(key: string): Promise<any> {
        return this.rawData.findCommittedByKey(key)
            .then((raws: IRawData[]) => {
                let first = head<IRawData>(raws);
                if (first) {

                    let obj = reduce(raws, (res: any, curr: IRawData) => {
                        return merge(res, curr.raw);
                    }, {});

                    return {
                        id: this.uuid.v4(),
                        uni: first.uni,
                        type: first.type,
                        key: first.key, obj,
                    } as IUniData;
                }
            });
    }

    private persistObject(obj: IUniData): Promise<any> {
        return this.uniData.save(obj).then(() => {
            return this.rawData.completeCommittedByKey(obj.key);
        });
    }

    private validateObj(obj: IUniData): Promise<IUniData> {
        return Promise.try(() => {
            let callable = this.schemas[obj.type];
            if (isUndefined(callable)) {
                throw new Error('Invalid Schema');
            }
            return callable.call(this);
        }).then((schema: UniSchema) => {
            return this.schema.validate(obj, schema);
        }).then(() => {
            return obj;
        });
    }

}
