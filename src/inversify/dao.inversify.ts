import { ContainerModule, interfaces } from 'inversify';

import { RawDataDao } from '../dao/RawDataDao';
import { UniDataDao } from '../dao/UniDataDao';
import { putSymbol } from './_helper';

const DaoModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<RawDataDao>(putSymbol('RawDataDao')).to(RawDataDao);
    bind<UniDataDao>(putSymbol('UniDataDao')).to(UniDataDao);
});

export { DaoModule };
