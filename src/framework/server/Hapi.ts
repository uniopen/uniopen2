import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';

import { IConfigManager } from '../../framework/config/IConfigManager';
import { IAsyncInit } from '../../framework/interface/IAsyncInit';
import { ILoggerManager } from '../../framework/logger/ILoggerManager';
import { asyncInit } from '../../inversify/_decorator';
import { getSymbol, PRIORITY_HIGH } from '../../inversify/_helper';
import { IServerHandler } from '../interface/IServerHandler';
import { IServerMethod } from '../interface/IServerMethod';

const H = require('hapi');

@injectable()
export class Hapi implements IAsyncInit {

    private server: any;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_HIGH)
    public init(): Promise<void> {
        return Promise.try(() => {
            return this.build();
        });
    }

    public connect(): Promise<void> {
        return Promise.try(() => {
            return this.server.start();
        }).return();
    }

    public disconnect(): Promise<void> {
        return Promise.try(() => {
            return this.server.stop();
        }).return();
    }

    public addRoute(method: IServerMethod, path: string, handler: IServerHandler): Promise<void> {
        return Promise.try(() => {
            this.server.route({ method, path, handler });
        });
    }

    private build(): Promise<void> {
        return Promise.try(() => {
            const port = this.config.number('SERVER_PORT');
            const host = this.config.string('SERVER_HOST');

            console.log('listen >>>', { host, port });

            this.server = new H.Server({ host, port });
        });
    }

}
