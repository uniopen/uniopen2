import * as Promise from 'bluebird';

export interface IAsyncInit {
    init(args?: any): Promise<void>;
}
