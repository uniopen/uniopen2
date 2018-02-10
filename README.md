UniOpen2
=======
###### http://www.uniopen.org

UniOpen2 is a reboot of the initial Uniopen idea.


The aim of this project is to collect public data related to university life - canteens, libraries, places, etc. - and make them available in a nice JSON format.

In this repo you can find a base architecture that handles the flow of starting web grabber and store data into a MongoDB collection.

## Getting Started

Following these instruction you will be able to run a copy of the project on your local machine and to create and start your first data grabber.

We set up a docker-compose configuration that provides to build a network with redis, mongo and nodejs and let you focus only on grabber creation.

Anyway if you prefer a docker use of the project you'll need to have these software up and running:
* Node.js - https://nodejs.org/
* MongoDB - https://www.mongodb.com
* Redis   - https://redis.io/

We will guide you through both of use cases.

### Docker ( Linux, MacOS, Windows )

First of all we assume that you have docker and docker-compose installed.
If it's not your case, follow installation guide on https://docs.docker.com/compose/install/

Now clone or download this repo and run
````
docker-compose up
````

You can now create your personal grabber simply working on grabber folder.

To stop, open another terminal and use `docker-compose down` command.

Notes:
* first time `docker-compose up` may take some time because it has to download all node, mongo and redis images
* for more info on what docker is and how it works refer to https://www.docker.com/what-docker

### Windows

#### Installation and configuration
* Download MongoDB CommunityServer from <a href="https://www.mongodb.com/download-center?jmp=tutorials&_ga=2.113936131.522114138.1515703783-502495108.1515280989#atlas">here<a> and install it (you only need basic stuff, things like MongoDB Compass are not necessary). Next you have to configure it following this guide <a href="https://docs.mongodb.com/tutorials/install-mongodb-on-windows/">Install MongoDB on windows<a>
* Download Redis for windows from <a href="github.com/MicrosoftArchive/redis">here<a> (if you download the .zip file instead of .msi, installation isn't required).
* Download and install the latest version of Node from <a href="https://nodejs.org/">here<a>
* Clone or download this repo and initialize it by running the following command in the terminal into the project folder ```npm install```
* Rename .env.dev file into .env and setup your configuration parameters

#### Launch
In order to launch the project you have first to open MongoDB and Redis, finally you can open Uniopen:
* MongoDB: open a terminal and run ```"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"```
* Redis: simply double click ```redis-server.exe```
* Uniopen: open a terminal into Uniopen's folder and run ```node .\build\application.js```

### MacOS

#### Installation and configuration
The simplest way to install all the necessary software is through [Homebrew](https://brew.sh/index_it.html). So first of all paste
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
to install that. Then run ```brew update``` to make sure Homebrew is up to date.
Now you can install
* Nodejs with
  ```
  brew install node
  ```
* Redis with
  ```
  brew install redis
  ```

* MongoDB with
  ```
  brew install mongodb
  ```
  Then you also need to run ```mkdir -p /data/db``` to create the default /data/db directory.

* Clone or download this repo and initialize it by running the following command in the terminal into the project folder ```npm install```
* Rename .env.dev file into .env and setup your configuration parameters

#### Launch
In order to launch the project you have first to open MongoDB and Redis, finally you can open Uniopen:
* MongoDB - open a terminal and run ```mongod``` and keep it running
* Redis - open another terminal run ```redis-server```
* Uniopen - open a third terminal, go into project cloned directory and run ```npm run dev```

### Linux

#### Installation and configuration

* Nodejs can be installed via package manager.<br>
  You can find the right way to do that depending on your current distribution on the official nodejs page https://nodejs.org/en/download/package-manager/

* The suggested way of installing Redis is compiling it from sources follow this simple steps
  ```
  wget http://download.redis.io/redis-stable.tar.gz
  tar xvzf redis-stable.tar.gz
  cd redis-stable
  make
  ```
  After the compilation the src directory inside the Redis distribution is populated with the different executables. It is a good idea to copy both the Redis server and the command line interface in proper places, either manually using the following commands:
  ```
  sudo cp src/redis-server /usr/local/bin/
  sudo cp src/redis-cli /usr/local/bin/
  ```
  Or just using `sudo make install`

* For the best installation experience, MongoDB provides packages for popular Linux distributions. You can find the installation process guides [here](https://docs.mongodb.com/manual/administration/install-on-linux/)


* Clone or download this repo and initialize it by running the following command in the terminal into the project folder ```npm install```
* Rename .env.dev file into .env and setup your configuration parameters

#### Launch
In order to launch the project you have first to open MongoDB and Redis, finally you can open Uniopen:
* MongoDB - open a terminal and run ```sudo service mongod start``` and keep it running
* Redis - open another terminal run ```redis-server```
* Uniopen - open a third terminal, go into project cloned directory and run ```npm run dev```

## Use
Now you are ready to use Uniopen!<br>
Open your web browser and go to 127.0.0.1:5000/api/[service]<br>

Available services are:
##### `find-all`
return currently implemented grabbers
##### `full-scan`
start all currently implemented grabbers
##### `grabber[/uni][/type]`
start only a specific grabber following the request pattern. If not type provided start all uni associate grabbers. If called without uni and type works like full-scan.
##### `get[/uni][/type][/obj_id]`
data consulting service.
* `get` without params return an array of object {uni, data[]} with all uni and associate data types in the current mongo collection, if no data return an empty array.
```
 {
   "statusCode":200,
   "message":
    [
      {"data":["mensa"],"uni":"unive"},
      {"data":["biblio"],"uni":"unipd"}
    ]
  }
```
* `get/uni` return an object {uni, data[]} relative to required uni.
```
 {
   "statusCode":200,
   "message": {"data":["biblio"],"uni":"unipd"}
 }
```
* `get/uni/type` return an array of all objects of required uni/type
```
 {
   "statusCode":200,
   "message":
    [
      {
        "id": "419ae894-5e31-462b-aa81-b71ecba80f68",
        "obj": {
          "nome": "Biblioteca Slavistica e Ungherese",
          "indirizzo": "Via Prosdocimo Beldomandi, 1 - 35137 Padova",
          "posti": 24
        }
      }
      // ...
    ]
```
* `get/uni/type/id` return specified object data

## How to implement your own grabber

You can find some examples in ```grabber``` folder

You may think about this project as something like a crawler, for each university it has a set of urls and grabbers.
Usually these urls represent main pages of different categories (i.e. libraries or canteens), for each page you need to create a grabber, that pick up all the informations it can find (i.e. a list of libraries where each of them have a link to the details page), then it commits partial information, it uses relative links to open other pages and so on, until it has all the necessary data to fill the DB.

Let's get started with the actual instructions:

* open ```src/service/temp/services.db.ts```, as you can see, in this file there is an array that contains a list of universities, each of them contains an array of objects that represent different categories. If you want to add a grabber, you have to put in the relative university's array (if your university is not present, simply add it with the same structure of the others) a new object with:
  * type: the name of the chosen category, also the name of the folder where you have to put your grabber.
  * code: the name of the main grabber for the category.
  * urls: the list of urls necessary to your grabber.

* now you have to create your grabber file into ```grabber/[university code]/[category code]/```, and place your code into a function that will receive urls as a parameter.
For example:
```javascript
(function (args) {
  return httpGet(args.url).then((res) => {
        return res.text();
    }).then((source) => {
        let $ = parseHtml(source);

        // [use jquery-like code to get your data from $]
        let url = [objects_url]  // i.e. library's details url
        let key = [objects_key]  // i.e. library's short name

        //use partialData() if you don't have all the informations and next call a specifica grabber with callGrabber()
        partialData(args.uni, args.type, args.code, url, key, { [put partial data here] });
        callGrabber(args.uni, args.type, grabberCode, href, key);   

        //else, if you have all the necessary you can use commitData()
        commitData(args.uni, args.type, args.code, args.url, args.key, { [put data here] });
    }).catch((err) => {
        console.error(err.message, err.stack);
    });
});
```

#### Grabber Helpers APIs
As you may have notice in the grabber code example there are some function that you can consider like some API helpers that we provide to integrate your grabber into our uniopen2 proposed flow. These are:
*
#####  `callGrabber( uni, type, code, url, [key], [raw] )` <br>
Call another grabber. Useful if your information is fragmented into multiple pages or other cases relative to informations partitioning.<br>
Function parameters are:
 * `uni`  - string that identify university (eg. unipd, unive, ... )
 * `type` - string that identify the type of information parsed (see [`types`](#Object-validation-types))
 * `code` - reference to grabber file name (eg. default, iniziative-venete, ...)
 * `url` - url to be parsed from the called grabber
 * `key` - optional string identifying parsed object store key (usually generated through helper function `rawkey`);
 * `raw` - optional data object useful if you need to share something with the new grabber

##### `partialData( uni, type, code, url, key, [raw] )`
Used when you can submit only partial data, maybe because you must call another grabber to complete information retrieval. <br>
Function parameters are:
 * `uni`  - current university code accessible by `args.uni`
 * `type` - parsed information type (see [`types`](#Object-validation-types))
 * `code` - current grabber filename accessible by `args.code`
 * `url` - url associate to parsed data
 * `key` - string identifying parsed object store key (usually generated through helper function `rawkey` or, if already present by previus flow calls, accessible by `args.key`);
 * `raw` - object contain raw parsed information that will be saved

##### `commitData( uni, type, code, url, key, raw )`
Function that commits the data passed in the raw param. Stop the current grabber(s) flow and try to validate raw object, according with selected type, then store it. <br>
Function parameters are:
* `uni`  - current university code accessible by `args.uni`
* `type` - parsed information type (see [`types`](#Object-validation-types)) ( current accessible by `args.type` )
* `code` - current grabber filename accessible by `args.code`
* `url` - url associate to parsed data
* `key` - string identifying parsed object store key (usually generated through helper function `rawkey` or, if already present by previus flow calls, accessible by `args.key`);
* `raw` - object contain raw parsed information that will be saved

#### Object validation types

Until now we provide a basic support to grabber based on 3 types:

##### `mensa`
Object representing canteens.<br>
To be valid needs to have following data:
* [__required__ string] `nome`  - canteen's name
* [__required__ string] `indirizzo` - canteen's address
* [string] `note` - optional notes

##### `studio`
Object representing places dedicated to personal study. <br>
To be valid needs to have following data:
* [__required__ string] `nome` -  place's name
* [__required__ string] `indirizzo` - place's address
* [number] `posti` -  room capacity
* [timetable] `orari` - timetable follow a specific format type
* [string] `note` - optional notes

##### `biblio`
Object representing library. <br>
To be valid needs to have following data:
* [__required__ string] `nome` -  library's name
* [__required__ string] `indirizzo` -  library's address
* [number] `posti` -  room capacity
* [timetable] `orari` - timetable follow a specific format type
* [string] `note` - optional notes

###### special validation types
###### `timetable`
It's an array containing from 1 to 7 element formatted in one of follows options:
```
// days interval
lun - ven 10:30 - 11:20

// single day
gio 10:20 - 11:20

// multiple days
mer, sab, dom 17:00 - 14:00

```
valid days names are `lun`, `mar`, `mer`, `gio`, `ven`, `sab`, `dom`<br>
We provide an helper function that you can use to translate a string like `lunedì - giovedì 11 - 21` to an accepted format (see [normalizeTimetable](https://github.com/uniopen/uniopen2/blob/5c563d65035f248b88b61579e877e4f42931f6c7/src/framework/helper/ScriptHelper.ts#L134) )
