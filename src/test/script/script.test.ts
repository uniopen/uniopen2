import 'reflect-metadata';

import * as Dotenv from 'dotenv';
import { join } from 'path';

import { ScriptHelper } from '../../framework/helper/ScriptHelper';
import { Kernel } from '../../inversify/kernel';

let file = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
let config = { path: join(__dirname, '../../../', file) };

console.log('config >>>', config);

Dotenv.config(config);

let end: number;
let start: number;
let kernel: Kernel;
let helper: ScriptHelper;

Kernel.instance()
    .then((instance: Kernel) => {
        kernel = instance;
        return kernel.get<ScriptHelper>('ScriptHelper');
    })
    .then((instance: ScriptHelper) => {
        helper = instance;
        start = new Date().getTime();
        return null; // helper.run(js(), args());
    })
    .then((result: any) => {
        end = new Date().getTime();
        console.info('result >>>', result, (end - start));
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error('error >>>', err);
        process.exit(1);
    });
