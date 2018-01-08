export class Metadata {
    public key: string | number | symbol;
    public value: any;
    public params: { [k: string]: any } | undefined;

    public constructor(key: string | number | symbol, value: any, params?: { [k: string]: any }) {
        this.key = key;
        this.value = value;
        this.params = params;
    }

    public toString() {
        let params = JSON.stringify(this.params);
        return `tagged: { key:${this.key.toString()}, value: ${this.value}, params: ${params} }`;
    }
}
