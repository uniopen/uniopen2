import { reduce, merge } from 'lodash';

(function run() {
    let key = 'de5edce3-c52b-4a6d-a6fc-ced75468c877';
    let raws = [{ key, titolo: 'Mario', descrizione: 'Rossi', note: 'Boo' }];

    let raw = reduce(raws, (res: any, curr: any) => {
        return merge(res, curr);
    }, {});

    console.log(raw);
})();

(function run() {
    let key = 'de5edce3-c52b-4a6d-a6fc-ced75468c877';
    let raws = [
        { key, titolo: 'Mario' },
        { key, descrizione: 'Rossi' },
        { key, note: 'Boo' },
    ];

    let raw = reduce(raws, (res: any, curr: any) => {
        return merge(res, curr);
    }, {});

    console.log(raw);
})();
