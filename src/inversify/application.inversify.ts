import { ContainerModule, interfaces } from 'inversify';

import { Application } from '../application/Application';
import { IComponent } from '../framework/interface/IComponent';
import { putSymbol } from './_helper';

const ApplicationModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<IComponent>(putSymbol('Application')).to(Application).inSingletonScope();
});

export { ApplicationModule };
