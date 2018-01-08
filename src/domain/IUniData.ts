import { ObjectId } from 'mongodb';

export interface IUniData {
    _id?: ObjectId;
    uni: string;
    type: string;
    key: string;
    id: string;
    obj: any;
}
