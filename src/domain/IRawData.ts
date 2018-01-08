import { ObjectId } from 'mongodb';

export interface IRawData {
    _id?: ObjectId;
    uni: string;
    type: string;
    key: string;
    status?: string;
    raw: any;
}
