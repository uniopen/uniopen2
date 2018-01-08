import * as Promise from 'bluebird';
import { Container } from 'inversify';
import { each, get, groupBy, has, isObject, map, size, toNumber } from 'lodash';

import { getAsyncInit } from './_decorator';
import { getSymbol, getSymbols, PRIORITIES, PRIORITY_DEFAULT } from './_helper';
import { Metadata } from './_metadata';
import { AdapterModule } from './adapter.inversify';
import { ApplicationModule } from './application.inversify';
import { DriverModule } from './driver.inversify';
import { FrameworkModule } from './framework.inversify';
import { HelperModule } from './helper.inversify';
import { ServiceModule } from './service.inversify';
import { ServerModule } from './server.inversify';
import { DaoModule } from './dao.inversify';

export class Kernel {

    private static _instance: Kernel;

    public static instance(): Promise<Kernel> {
        if (isObject(Kernel._instance)) {
            return Promise.resolve(Kernel._instance);
        }

        return new Promise<Kernel>((resolve: any, reject: any) => {
            Promise.try(() => {
                return new Kernel();
            }).then((instance: Kernel) => {
                Kernel._instance = instance;
                return instance.init();
            }).then(() => {
                return resolve(Kernel._instance);
            }).catch((err: Error) => {
                return reject(err);
            });
        });
    }

    private _container: Container;

    public constructor() {
        this._container = new Container({ defaultScope: 'Singleton' });

        this.loadModules();
        this.loadMiddleware();
    }

    public get<T>(name: string): T {
        return this._container.get<T>(getSymbol(name));
    }

    private loadModules(): void {
        this._container.load(DaoModule);
        this._container.load(HelperModule);
        this._container.load(DriverModule);
        this._container.load(ServiceModule);
        this._container.load(AdapterModule);
        this._container.load(ServerModule);
        this._container.load(FrameworkModule);
        this._container.load(ApplicationModule);
    }

    private loadMiddleware(): void {
        // this._container.applyMiddleware(logger, middleware1, middleware2);
    }

    private init(): Promise<void> {
        return new Promise<void>((resolve: any, reject: any) => {
            let beans: Array<{ meta: Metadata, bean: any }> = [];
            let groups: { [k: number]: Array<{ meta: Metadata, bean: any }> } = {};

            each(getSymbols(), (one: symbol) => {
                let bean = this._container.get(one);
                let meta = getAsyncInit(bean.constructor);

                // this.log.info('one -->', one, 'meta -->', meta);

                if (isObject(meta)) {
                    beans.push({ meta, bean });
                }
            });

            // this.log.info('beans -->', beans);

            groups = groupBy(beans, (one: { meta: Metadata, bean: any }) => {
                let priority = toNumber(get(one, 'meta.params.priority'));
                return isFinite(priority) ? priority : PRIORITY_DEFAULT;
            });

            // this.log.info('groups -->', groups);

            this.promiseLoop(groups, 0)
                .then(() => {
                    return resolve();
                })
                .catch((err: Error) => {
                    return reject(err);
                });
        });
    }

    private promiseLoop(groups: { [k: number]: Array<{ meta: Metadata, bean: any }> }, index: number): Promise<void> {
        if (index >= size(PRIORITIES)) {
            return Promise.resolve();
        }

        let priority = PRIORITIES[index];
        if (has(groups, priority) === false) {
            return this.promiseLoop(groups, index + 1);
        }

        return this.initGroup(groups[priority]).then(() => this.promiseLoop(groups, index + 1));
    }

    private initGroup(list: Array<{ meta: Metadata, bean: any }>): Promise<void> {
        return new Promise<void>((resolve: any, reject: any) => {
            let promises = map(list, (one: { meta: Metadata, bean: any }) => {
                let method = one.bean[one.meta.value];
                return method.call(one.bean);
            });
            return Promise.all(promises).then(() => resolve())
                .catch((err: Error) => reject(err));
        });
    }
}
