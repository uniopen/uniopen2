import { indexOf } from 'lodash';

export const SYMBOLS: symbol[] = [];

export const PRIORITY_STARTUP: number = 0;
export const PRIORITY_HIGH: number = 100;
export const PRIORITY_MEDIUM: number = 200;
export const PRIORITY_LOW: number = 300;
export const PRIORITY_DEFAULT: number = 400;

export const PRIORITIES: number[] = [
    PRIORITY_STARTUP,
    PRIORITY_HIGH,
    PRIORITY_MEDIUM,
    PRIORITY_LOW,
    PRIORITY_DEFAULT,
];

export function putSymbol(name: string): symbol {
    let out = Symbol.for(name);
    if (indexOf(SYMBOLS, out) === -1) {
        SYMBOLS.push(out);
    }
    return out;
}

export function getSymbol(name: string): symbol {
    return Symbol.for(name);
}

export function getSymbols(): symbol[] {
    return SYMBOLS;
}
