import { ContainerModule, interfaces } from 'inversify';

import { DateHelper } from '../framework/helper/DateHelper';
import { HashHelper } from '../framework/helper/HashHelper';
import { HtmlHelper } from '../framework/helper/HtmlHelper';
import { HttpHelper } from '../framework/helper/HttpHelper';
import { SchemaHelper } from '../framework/helper/SchemaHelper';
import { ScriptHelper } from '../framework/helper/ScriptHelper';
import { UuidHelper } from '../framework/helper/UuidHelper';
import { putSymbol } from './_helper';

const HelperModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<HtmlHelper>(putSymbol('HtmlHelper')).to(HtmlHelper).inSingletonScope();
    bind<HttpHelper>(putSymbol('HttpHelper')).to(HttpHelper).inSingletonScope();
    bind<HashHelper>(putSymbol('HashHelper')).to(HashHelper).inSingletonScope();
    bind<UuidHelper>(putSymbol('UuidHelper')).to(UuidHelper).inSingletonScope();
    bind<DateHelper>(putSymbol('DateHelper')).to(DateHelper).inSingletonScope();
    bind<ScriptHelper>(putSymbol('ScriptHelper')).to(ScriptHelper).inSingletonScope();
    bind<SchemaHelper>(putSymbol('SchemaHelper')).to(SchemaHelper).inSingletonScope();
});

export { HelperModule };
