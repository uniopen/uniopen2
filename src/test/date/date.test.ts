import { DateHelper } from '../../framework/helper/DateHelper';
import { ConfigManager } from '../../framework/config/ConfigManager';
import { WinstonLogger } from '../../framework/logger/WinstonLogger';

let date = new DateHelper( new ConfigManager() , new WinstonLogger( new ConfigManager() ));

let d1 = date.stringToMillis('1507105706069');
let d2 = date.millis();

console.log('d1: ' + d1);

console.log('d2: ' + d2);
console.log('d1 < d2: ' + date.isBefore(d1, d2));
console.log('d1 > d2: ' + date.isBefore(d2, d1));
