import { interfaces } from 'inversify';

export function logger(planAndResolve: interfaces.Next): interfaces.Next {
    return (args: interfaces.NextArgs) => {
        let start = new Date().getTime();
        let result = planAndResolve(args);
        let end = new Date().getTime();
        console.log(end - start);
        return result;
    };
}

export function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
    return (args: interfaces.NextArgs) => {
        let nextContextInterceptor = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context) => {
            console.log(context);
            return nextContextInterceptor(context);
        };
        return planAndResolve(args);
    };
}

export function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
    return (args: interfaces.NextArgs) => {
        let id = args.serviceIdentifier.toString();
        console.log(`Middleware1: ${id}`);
        return planAndResolve(args);
    };
}
