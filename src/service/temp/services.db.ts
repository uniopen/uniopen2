import * as Promise from 'bluebird';
import { each, find, isObject, map } from 'lodash';

export class ServicesDb {
    public static findAll(): Promise<any[]> {
        return Promise.try(() => {
            return [{
                id: '3d540092-1e28-44eb-bda9-4558116b02c6',
                code: 'unipd',
                name: 'Università degli studi di Padova',
                objects: [
                  {
                    type: 'studio',
                    code: 'default',
                    urls: ['http://www.unipd.it/aule-studio'],
                  },
                  {
                    type: 'biblio',
                    code: 'start',
                    urls: ['http://bibliotecadigitale.cab.unipd.it/biblioteche/elenco-delle-biblioteche'],
                  },
                ],
            }, {
                id: '0819d80a-39dc-4d7f-80ab-9071d97ee73b',
                code: 'unive',
                name: `Università Ca' Foscari Venezia`,
                objects: [{
                    type: 'mensa',
                    code: 'default',
                    urls: ['http://www.esuvenezia.it/web/esuvenezia/servizi/servizi-interna?p_p_id=ALFRESCO_MYPORTAL_CONTENT_PROXY_WAR_myportalportlet_INSTANCE_l6Hb&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&template=/regioneveneto/myportal/html-generico-detail&uuid=01acd1dc-bf22-431d-b07c-a72f3535c498&contentArea=_ESUVenezia_servizi-interna_Body1_&selVert=menu-contestuale_709349e4-ef47-4251-bb50-624e4b22da37'],
                },
                {
                    type: 'biblio',
                    code: 'default',
                    urls: ['http://www.unive.it/pag/4750/'],
                },],
            }];
        });
    }

    public static objects(): Promise<any[]> {
        return ServicesDb.findAll().
            then((services: any[]) => {
                let list: any[] = [];
                each(services, (service: any) => {
                    each(service.objects, (object: any) => {
                        list.push({ uni: service.code, type: object.type });
                    });
                });
                return list;
            });
    }

    public static findUrls(uni: string, type: string): Promise<any[]> {
        return ServicesDb.findAll()
            .then((services: any[]) => {
                return find(services, (service: any) => {
                    return service.code === uni;
                });
            })
            .then((service: any) => {
                return find(service.objects, (object: any) => {
                    return object.type === type;
                });
            })
            .then((object: any) => {
                return map(object.urls, (url: string) => {
                    return { uni, type, url, code: object.code };
                });
            });
    }
}
