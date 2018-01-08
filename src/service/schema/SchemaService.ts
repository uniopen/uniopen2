import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { get } from 'lodash';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { IComponent } from '../../framework/interface/IComponent';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../../inversify/_helper';
import { BiblioSchemaBuilder } from './builder/BiblioSchemaBuilder';
import { MensaSchemaBuilder } from './builder/MensaSchemaBuilder';
import { StudioSchemaBuilder } from './builder/StudioSchemaBuilder';
import { UniSchema } from './UniSchema';

@injectable()
export class SchemaService implements IComponent {

    private schemas: { [key: string]: UniSchema };

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            this.schemas = {
                biblio: new BiblioSchemaBuilder().build(),
                studio: new StudioSchemaBuilder().build(),
                mensa: new MensaSchemaBuilder().build(),
            };
        });
    }

    public run(item: { value: any, code: string }): Promise<UniSchema> {
        return Promise.try(() => {
            return get<UniSchema>(this.schemas, item.code);
        });
    }

}
