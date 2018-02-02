import { ContainerModule, interfaces } from 'inversify';

import { ObjectManager } from '../service/manager/ObjectManager';
import { RestManager } from '../service/manager/RestManager';
import { DigestService } from '../service/object/DigestService';
import { EndpointService } from '../service/object/EndpointService';
import { GrabberService } from '../service/object/GrabberService';
import { FindAllAction } from '../service/rest/FindAllAction';
import { FullScanAction } from '../service/rest/FullScanAction';
import { GetDataAction } from '../service/rest/GetDataAction';
import { putSymbol } from './_helper';

const ServiceModule = new ContainerModule((bind: interfaces.Bind) => {
    //#region GRABBING
    bind<ObjectManager>(putSymbol('ObjectManager')).to(ObjectManager);
    bind<DigestService>(putSymbol('DigestService')).to(DigestService);
    // bind<PersistService>(putSymbol('PersistService')).to(PersistService);
    // bind<CrawlerService>(putSymbol('CrawlerService')).to(CrawlerService);
    bind<GrabberService>(putSymbol('GrabberService')).to(GrabberService);
    bind<EndpointService>(putSymbol('EndpointService')).to(EndpointService);
    //#endregion

    //#region REST
    bind<RestManager>(putSymbol('RestManager')).to(RestManager);
    bind<FindAllAction>(putSymbol('FindAllAction')).to(FindAllAction);
    bind<FullScanAction>(putSymbol('FullScanAction')).to(FullScanAction);
    bind<GetDataAction>(putSymbol('GetDataAction')).to(GetDataAction);
    //#endregion
});

export { ServiceModule };
