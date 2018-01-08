import { IAsyncInit } from '../interface/IAsyncInit';

export interface IConfigManager extends IAsyncInit {
    value(key: string): any;
    string(key: string): string;
    number(key: string): number;
}
