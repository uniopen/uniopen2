import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../framework/config/IConfigManager';
import { IComponent } from '../framework/interface/IComponent';
import { IServerRequest } from '../framework/interface/IServerRequest';
import { IServerResponse } from '../framework/interface/IServerResponse';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { Hapi } from '../framework/server/Hapi';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../inversify/_helper';
import { RestManager } from '../service/manager/RestManager';

@injectable()
export class HapiAdapter implements IComponent {

    private services: { [key: string]: () => Promise<void> };

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('RestManager')) private rest: RestManager,
        @inject(getSymbol('Hapi')) private hapi: Hapi) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            return this.registerRoutes();
        });
    }

    public run(): Promise<void> {
        return Promise.try(() => {
            return this.startListeners();
        });
    }

    private startListeners(): Promise<void> {
        return Promise.try(() => {
            return this.hapi.connect();
        });
    }

    private registerRoutes(): Promise<void> {
        return Promise.all([this.homeRoute(), this.apiRoute()]).return();
    }

    private homeRoute(): Promise<void> {
        return Promise.try(() => {
            return this.hapi.addRoute('GET', '/', this.homeHandler);
        });
    }

    private apiRoute(): Promise<void> {
        return Promise.try(() => {
            // ['GET', 'POST', 'PUT', 'DELETE']
            return this.hapi.addRoute('*', '/api/{service}/{data*}', this.apiHandler);
        });
    }

    private homeHandler = (req: IServerRequest, h: IServerResponse) => {
        return h.response('Invalid request').code(400);
    }

    private apiHandler = (req: IServerRequest) => {
        // TODO: usare i tipi corretti "IActionInput"
        return this.rest.run({ action: req.params.service, body: req.params.data });
    }

}
