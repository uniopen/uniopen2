import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { map } from 'lodash';

import { IConfigManager } from '../framework/config/IConfigManager';
import { IComponent } from '../framework/interface/IComponent';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_MEDIUM } from '../inversify/_helper';
import { Kernel } from '../inversify/kernel';

@injectable()
export class Application implements IComponent {

    // TODO: aggiungere shutdown con gestione segnali

    // TODO: quanti Adapter sono???
    // TODO: aggiungere Adapter: scheduler (CronAdapter), events (RabbitMQAdapter), ...
    private names = ['HapiAdapter', 'BusAdapter'];
    private components: IComponent[] = [];
    private kernel: Kernel;

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager) { }

    @asyncInit(PRIORITY_MEDIUM)
    public init(): Promise<void> {
        return Kernel.instance()
            .then((instance: Kernel) => {
                this.kernel = instance;
                return this.loadAdapters();
            });
    }

    public run(args?: any): Promise<any> {
        return Promise.try(() => {
            return this.runAdapters();
        });
    }

    private runAdapters(): Promise<any> {
        return Promise.all(map(this.components, (one: IComponent) => one.run()));
    }

    private loadAdapters(): Promise<any> {
        return Promise.try(() => {
            this.components = map(this.names, (name: string) => {
                return this.kernel.get<IComponent>(name);
            });
        });
    }

}
