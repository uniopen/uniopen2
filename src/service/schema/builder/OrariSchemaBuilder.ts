import * as Joi from 'joi';

import { IBuilder } from '../../../framework/interface/IBuilder';
import { UniSchema } from '../UniSchema';

export class OrariSchemaBuilder implements IBuilder {

    public build(): UniSchema {
        return Joi.array()
            .min(0)
            .max(7)
            .items(
            Joi.string()
              .regex(/^(lun|mar|mer|gio|ven|sab|dom)((\s-\s(lun|mar|mer|gio|ven|sab|dom)){0,1}|(,\s(lun|mar|mer|gio|ven|sab|dom))*)\s+(\d{1,2}:\d{2}\s-\s\d{1,2}:\d{2})$/),
            // .allow('lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'),
        );
    }

}
