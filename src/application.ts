import 'reflect-metadata';

import * as Dotenv from 'dotenv';
import { join } from 'path';

import { IComponent } from './framework/interface/IComponent';
import { Kernel } from './inversify/kernel';

let file = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env';
let config = { path: join(__dirname, '../', file) };

console.log('config >>>', config);

Dotenv.config(config);

let kernel: Kernel;
let component: IComponent;

Kernel.instance()
    .then((instance: Kernel) => {
        kernel = instance;
        return kernel.get<IComponent>('Application');
    })
    .then((instance: IComponent) => {
        component = instance;
        return component.run();
    })
    .then(() => {
        console.info('Uniopen is running');
    })
    .catch((err: Error) => {
        console.error('Error starting Ambrogio', err);
        process.exit(1);
    });
