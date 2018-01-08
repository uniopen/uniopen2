import { ContainerModule, interfaces } from 'inversify';

import { Hapi } from '../framework/server/Hapi';
import { putSymbol } from './_helper';

const ServerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Hapi>(putSymbol('Hapi')).to(Hapi).inSingletonScope();
});

export { ServerModule };
