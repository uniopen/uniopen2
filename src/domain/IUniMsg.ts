import { ObjectId } from 'mongodb';

export interface IUniMsg {
    uni: string;
    type: string;
    code: string;
    url: string;
    key?: string;
    raw?: any;
}
