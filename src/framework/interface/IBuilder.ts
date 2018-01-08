import { UniSchema } from '../../service/schema/UniSchema';

export interface IBuilder {
    build(): UniSchema;
}
