UniOpen2
=======
###### http://www.uniopen.org

UniOpen2 is a reboot of the initial Uniopen idea.


The aim of this project is to collect public data related to university life - canteens, libraries, places, etc. - and make them available in a nice JSON format.

In this repo you can find a base architecture that handles the flow of starting web grabber and store data into a MongoDB collection.

## Getting Started

Following these instruction you will be able to run a copy of the project on your local machine and to create and start your first data grabber.

### Prerequisites

First of all in your machine you'll need to have these software up and running:
* Node.js - https://nodejs.org/
* MongoDB - https://www.mongodb.com
* Redis   - https://redis.io/


### Windows

#### Installation and configuration
* Download MongoDB CommunityServer from <a href="https://www.mongodb.com/download-center?jmp=tutorials&_ga=2.113936131.522114138.1515703783-502495108.1515280989#atlas">here<a> and install it (you only need basic stuff, things like MongoDB Compass are not necessary). Next you have to configure it following this guide <a href="https://docs.mongodb.com/tutorials/install-mongodb-on-windows/">Install MongoDB on windows<a>
* Download Redis for windows from <a href="github.com/MicrosoftArchive/redis">here<a> (if you download the .zip file instead of .msi, installation isn't required).
* Download and install the latest version of Node from <a href="https://nodejs.org/">here<a>
* Clone or download this repo and initialize it by running the following command in the terminal into the project folder ```npm install```

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

#### Launch
In order to launch the project you have first to open MongoDB and Redis, finally you can open Uniopen:
* MongoDB - open a terminal and run ```sudo service mongod start``` and keep it running
* Redis - open another terminal run ```redis-server```
* Uniopen - open a third terminal, go into project cloned directory and run ```npm run dev```

## API
Now you are ready to use Uniopen!<br>
Open your web browser and go to http://127.0.0.1:5000/api/find-all to see the list of the currently implemented grabbers.

### How to implement your own grabber

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
        
        [use jquery-like code to get your data from $]
        let url = [object's url]  //i.e. library's details url
        let key = [object's key]  //i.e. library's short name
        
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

####TODO: api (spiegare bene partialData, commitData, callGrabber)

####TODO: object validation (spiegare la struttura che devono avere gli oggetti)
