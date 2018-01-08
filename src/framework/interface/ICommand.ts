import * as Promise from 'bluebird';

export interface ICommand {
    run(args?: any): Promise<any>;
}
