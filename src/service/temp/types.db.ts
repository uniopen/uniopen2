import * as Promise from 'bluebird';

export class TypesDb {
    public static findAll(): Promise<any[]> {
        return Promise.try(() => {
            return [{
                id: 'e77b37fb-6da7-4429-b897-2844ff99dc92',
                code: 'mensa',
                name: 'Mense convenzionate',
            }, {
                id: 'c3f136bd-7a24-4228-96d1-411c3dc755f8',
                code: 'biblio',
                name: 'Biglioteche convenzionate',
            }, {
                id: '27b62919-3c66-40fb-b56a-01c1a739d135',
                code: 'studio',
                name: 'Aule Studio',
            }];
        });
    }
}
