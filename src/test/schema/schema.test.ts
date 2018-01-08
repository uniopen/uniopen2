import 'reflect-metadata';

import * as Dotenv from 'dotenv';
import * as Joi from 'joi';
import { join } from 'path';

import { SchemaHelper } from '../../framework/helper/SchemaHelper';
import { Kernel } from '../../inversify/kernel';
import { UniSchema } from '../../service/schema/UniSchema';

let file = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
let config = { path: join(__dirname, '../../../', file) };

console.log('config >>>', config);

Dotenv.config(config);

let kernel: Kernel;
let helper: SchemaHelper;

let schema: UniSchema = Joi.object().keys({
    id: Joi.string().required(),
    key: Joi.string().required(),
    uni: Joi.string().required(),
    type: Joi.string().required(),
    nome: Joi.string().required(),
    indirizzo: Joi.string(),
});

let data = {
    uni: 'unive',
    type: 'studio',
    key: 'unive-studio-pizzeria-da-pasqualino',
    nome: 'Pizzeria da Pasqualino',
    indirizzo: 'Via Pescatori 15',
    id: 'a884805e-d9d7-430f-b069-7a17ccae3f2e',
};

Kernel.instance()
    .then((instance: Kernel) => {
        kernel = instance;
        return kernel.get<SchemaHelper>('SchemaHelper');
    })
    .then((instance: SchemaHelper) => {
        helper = instance;
        return helper.validate(data, schema);
    })
    .then(() => {
        console.info('Data is VALID');
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error('Data is INVALID', err);
        process.exit(1);
    });
