import * as Joi from 'joi';

import { IBuilder } from '../../../framework/interface/IBuilder';
import { UniSchema } from '../UniSchema';
import { OrariSchemaBuilder } from './OrariSchemaBuilder';

export class MensaSchemaBuilder implements IBuilder {

    public build(): UniSchema {
        return Joi.object()
            .keys({
                id: Joi.string().required(),
                key: Joi.string().required(),
                uni: Joi.string().required(),
                type: Joi.string().required(),
                obj: Joi.object().keys({
                    nome: Joi.string().required(),
                    indirizzo: Joi.string(),
                    note: Joi.string().optional(),
                    // orari: new OrariSchemaBuilder().build(),
                }),
                created: Joi.date(),
                updated: Joi.date(),
            });
    }

}
