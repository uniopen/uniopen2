import { IAsyncInit } from '../interface/IAsyncInit';

export interface ILoggerManager extends IAsyncInit {
    log(level: string, msg: string, meta?: any): void;
    debug(msg: string, meta?: any): void;
    info(msg: string, meta?: any): void;
    warn(msg: string, ...meta: any[]): void;
    error(msg: string, meta?: any): void;
}
