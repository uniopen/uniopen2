import { IUniMsg } from '../../domain/IUniMsg';
import { HtmlHelper } from './HtmlHelper';
import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { get, isUndefined, join, kebabCase, set, words } from 'lodash';
import * as lodash from 'lodash';
import { parse } from 'url';
import { createContext, Script } from 'vm';
import { Context, RunningScriptOptions } from 'vm';

import { getSymbol } from '../../inversify/_helper';
import { IConfigManager } from '../config/IConfigManager';
import { Bus } from '../driver/msg/Bus';
import { ILoggerManager } from '../logger/ILoggerManager';
import { HashHelper } from './HashHelper';
import { HttpHelper } from './HttpHelper';

@injectable()
export class ScriptHelper {

    private cache: { [key: string]: Script } = {};

    public constructor(
        @inject(getSymbol('ConfigManager')) private config: IConfigManager,
        @inject(getSymbol('LoggerManager')) private log: ILoggerManager,
        @inject(getSymbol('HashHelper')) private hash: HashHelper,
        @inject(getSymbol('HttpHelper')) private http: HttpHelper,
        @inject(getSymbol('HtmlHelper')) private html: HtmlHelper,
        @inject(getSymbol('Bus')) private bus: Bus) { }

    public run(js: string, args?: any): Promise<any> {
        let end: number;
        let start: number;

        return Promise.try(() => {
            start = new Date().getTime();
            return this.execute(js, args);
        }).then((result: any) => {
            end = new Date().getTime();
            console.log('>>>>>>>>>> ScriptHelper >>>', (end - start));
            return result;
        });
    }

    private execute(js: string, args?: any): Promise<any> {
        const callable = this.build(js);
        return callable(args);
    }

    private build(js: string): (args?: any) => any {
        let hash = this.hash.hash(js);
        let script = get<Script>(this.cache, hash);
        if (isUndefined(script)) {
            script = new Script(js);
            set(this.cache, hash, script);
        }
        return script.runInContext(this.context(), this.options());
    }

    private context(): Context {
        return createContext({
            lodash,
            console,
            Promise,

            log: this.log,
            rawkey: this.rawkey,
            httpGet: this.httpGet,
            httpPost: this.httpPost,
            sanitize: this.sanitize,
            parseUrl: this.parseUrl,
            parseHtml: this.parseHtml,

            normalizeTimetable: this.normalizeTimetable,

            commitData: this.commitData,
            partialData: this.partialData,
            callGrabber: this.callGrabber,
        });
    }

    private options(): RunningScriptOptions {
        return { timeout: 30000 };
    }

    private partialData = (uni: string, type: string, code: string, url: any, key?: string, raw?: any) => {
        return Promise.try(() => {
            let data: IUniMsg = { uni, type, code, url, key, raw };
            // console.log('partial data >>>', data);
            return this.bus.publish('uniobj', 'partial-data', data);
        });
    }

    private commitData = (uni: string, type: string, code: string, url: any, key?: string, raw?: any) => {
        return Promise.try(() => {
            let data: IUniMsg = { uni, type, code, url, key, raw };
            // console.log('commit data >>>', data);
            return this.bus.publish('uniobj', 'commit-data', data);
        });
    }

    private callGrabber = (uni: string, type: string, code: string, url: any, key?: string, raw?: any) => {
        return Promise.try(() => {
            let data = { uni, type, code, url, key, raw };
            // console.log('call grabber >>>', data);
            return this.bus.publish('uniobj', 'grab-data', data);
        });
    }

    private httpPost = (url: string, body?: any, headers?: any) => {
        return this.http.post(url, body, headers);
    }

    private httpGet = (url: string, headers?: any) => {
        return this.http.get(url, headers);
    }

    private rawkey = (uni: string, type: string, nome: string) => {
        return kebabCase(join([uni, type, nome]));
    }

    private sanitize = (text: string) => {
        return join(words(text), ' ');
    }

    private parseHtml = (source: string) => {
        return this.html.load(source);
    }

    private parseUrl = (url: string) => {
        return parse(url);
    }

    private normalizeTimetable = (str: string, type?: number) => {
      let formatted = str.toLowerCase()
        .replace(/lunedì/i, 'lun')
        .replace(/martedì/i, 'mar')
        .replace(/mercoledì/i, 'mer')
        .replace(/giovedì/i, 'gio')
        .replace(/venerdì/i, 'ven')
        .replace(/sabato/i, 'sab')
        .replace(/domenica/i, 'dom')
        .replace(/([A-Za-z])[^\w]+(\d)/, '$1 $2')
        .replace(/(\d)[^0-9 -]+(\d)/g, '$1:$2')
        .replace(/(\s\d+)(\s|$)/, '$1:00')
        .replace(/(\d+)[^\w:]+(\d+)/, '$1 - $2');
      switch (type) {
        case 1:
          formatted = formatted.replace(/([A-Za-z])(?:[^\w]+([A-Za-z]))+/g, '$1, $2');
          break;
        default:
          formatted = formatted.replace(/([A-Za-z]+)[^\w]+([A-Za-z]+)/, '$1 - $2');
      }
      return formatted.trim();
    }
}
