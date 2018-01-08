import { ContainerModule, interfaces } from 'inversify';

import { Mongodb } from '../framework/driver/db/Mongodb';
import { Redis } from '../framework/driver/db/Redis';
import { Bus } from '../framework/driver/msg/Bus';
import { putSymbol } from './_helper';

const DriverModule = new ContainerModule((bind: interfaces.Bind) => {
    // bind<Database>(putSymbol('Database')).to(Database).inSingletonScope();
    bind<Mongodb>(putSymbol('Mongodb')).to(Mongodb).inSingletonScope();
    bind<Redis>(putSymbol('Redis')).to(Redis).inSingletonScope();
    bind<Bus>(putSymbol('Bus')).to(Bus).inSingletonScope();
});

export { DriverModule };
