import * as Promise from 'bluebird';
import { each, find, isObject, map } from 'lodash';
import { readFile } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

export class ServicesDb {

    public static findAll(): Promise<any[]> {
        return new Promise((resolve, reject) => {
          let obj: any;
          let base: string = process.env.SCRIPT_PATH || './grabber';
          let path = join(__dirname, '../../..', base, 'config.json');
          return readFile(path, 'utf8', (err: Error, data: string) => {
            if (err) { reject(err); }
            return resolve(JSON.parse(data));
          });

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

    public static objects_filter(input: any[]): Promise<any[]>{
        return ServicesDb.findAll().
            then((services: any[]) => {
                let list: any[] = [];
                each(services, (service: any) => {
                    if(input[0] === service.code){
                        //Se è specificata solo l'università, aggiungo tutti i grabber di quell'università
                        if(input.length === 1)
                            each(service.objects, (object: any) => {
                                list.push({ uni: service.code, type: object.type });
                            });
                        //Altrimenti aggiungo solo i grabber del tipo specificato
                        else if(input.length >= 2)
                            each(service.objects, (object: any) => {
                                if(input[1] === object.type){
                                    console.log("Aggiunto " + object.type + " per " + service.code + " alla lista" )
                                    list.push({ uni: service.code, type: object.type });
                                }
                            });
                    }
                });
                return list;
            });
    }

    public static supportedObj(): Promise<any[]> {
        return ServicesDb.findAll().
            then((services: any[]) => {
                let list: any = {};
                each(services, (service: any) => {
                    list[service.code] = new Array();
                    each(service.objects, (object: any) => {
                        list[service.code].push(object.type);
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
