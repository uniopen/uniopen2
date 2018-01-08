import { Schema } from 'joi';

export interface ISchemaBuilder {
    build(): Schema;
}
