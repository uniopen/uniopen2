import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { isUndefined, toString } from 'lodash';

import { IConfigManager } from '../framework/config/IConfigManager';
import { Bus } from '../framework/driver/msg/Bus';
import { IComponent } from '../framework/interface/IComponent';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { asyncInit } from '../inversify/_decorator';
import { getSymbol, PRIORITY_LOW } from '../inversify/_helper';
import { DigestService } from '../service/object/DigestService';
import { EndpointService } from '../service/object/EndpointService';
import { GrabberService } from '../service/object/GrabberService';

@injectable()
export class BusAdapter implements IComponent {

    private services: { [key: string]: (args: any) => Promise<void> };

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('EndpointService')) private endpoint: EndpointService,
        @inject(getSymbol('GrabberService')) private grabber: GrabberService,
        @inject(getSymbol('DigestService')) private digest: DigestService,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    @asyncInit(PRIORITY_LOW)
    public init(): Promise<void> {
        return Promise.try(() => {
            return this.registerServices();
        });
    }

    public run(): Promise<void> {
        return Promise.try(() => {
            return this.startListeners();
        });
    }

    private startListeners(): Promise<void> {
        return Promise.try(() => {
            this.bus.subscribe('uniobj', '*', this.handler);
        });
    }

    private handler = (data: any, env: any): void => {
        // console.log('handler >>>', data, env);
        let channel = toString(env.channel);
        let topic = toString(env.topic);

        let callable = this.services[topic];
        if (isUndefined(callable)) {
            throw new Error('Invalid Topic');
        }
        return callable.call(this, data);
    }

    private registerServices(): Promise<void> {
        return Promise.try(() => {
            this.services = {
                // FIXME: da togliere
                'extract-urls': (args) => this.endpoint.extract(args),
                'grab-data': (args) => this.grabber.runScript(args),
                'partial-data': (args) => this.grabber.partialData(args),
                'commit-data': (args) => this.grabber.commitData(args),
                'digest-raw': (args) => this.digest.validate(args),
            };
        });
    }

}
