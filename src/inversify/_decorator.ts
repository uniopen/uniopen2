import { Metadata } from './_metadata';

export function asyncInit(priority: number): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let metadata = new Metadata('ASYNC_INIT', propertyKey, { priority });

        if (Reflect.hasOwnMetadata('ASYNC_INIT', target.constructor)) {
            throw new Error('MULTIPLE_ASYNC_INIT_METHODS');
        }

        Reflect.defineMetadata('ASYNC_INIT', metadata, target.constructor);
    };
}

export function getAsyncInit(target: any): Metadata {
    return Reflect.getMetadata('ASYNC_INIT', target);
}
