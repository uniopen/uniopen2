import { ContainerModule, interfaces } from 'inversify';

import { ICacheManager } from '../framework/cache/ICacheManager';
import { RedisCacheManager } from '../framework/cache/RedisCacheManager';
import { ILoggerManager } from '../framework/logger/ILoggerManager';
import { WinstonLogger } from '../framework/logger/WinstonLogger';
import { ConfigManager } from './../framework/config/ConfigManager';
import { IConfigManager } from './../framework/config/IConfigManager';
import { putSymbol } from './_helper';

const FrameworkModule = new ContainerModule((bind: interfaces.Bind) => {
    // ATTENZIONE: ConfigManager deve stare per primo
    bind<IConfigManager>(putSymbol('ConfigManager')).to(ConfigManager).inSingletonScope();
    bind<ILoggerManager>(putSymbol('LoggerManager')).to(WinstonLogger).inSingletonScope();
    bind<ICacheManager>(putSymbol('CacheManager')).to(RedisCacheManager).inSingletonScope();
});

export { FrameworkModule };
