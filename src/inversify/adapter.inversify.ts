import { ContainerModule, interfaces } from 'inversify';

import { BusAdapter } from '../adapter/BusAdapter';
import { HapiAdapter } from '../adapter/HapiAdapter';
import { IComponent } from '../framework/interface/IComponent';
import { putSymbol } from './_helper';

const AdapterModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<IComponent>(putSymbol('HapiAdapter')).to(HapiAdapter).inSingletonScope();
    bind<IComponent>(putSymbol('BusAdapter')).to(BusAdapter).inSingletonScope();
});

export { AdapterModule };
