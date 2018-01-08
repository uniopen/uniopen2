import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { validate, ValidationError } from 'joi';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { getSymbol } from '../../inversify/_helper';
import { UniSchema } from '../../service/schema/UniSchema';

@injectable()
export class SchemaHelper {

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    public validate(value: any, schema: UniSchema): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            return validate(value, schema,
                (err: ValidationError, value) => {
                    if (err === null) {
                        return resolve();
                    }
                    return reject(err);
                });
        });
    }

    // Esempio di schema
    /* private get schema(): Schema {
        return Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            access_token: [Joi.string(), Joi.number()],
            birthyear: Joi.number().integer().min(1900).max(2013),
            email: Joi.string().email(),
        }).with('username', 'birthyear').without('password', 'access_token');
    } */

}
