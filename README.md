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

### Linux/MacOS

#### Installation and configuration
todo

#### Launch
todo

## API
Now you are ready to use Uniopen!<br>
Open your web browser and go to http://127.0.0.1:5000/api/find-all to see the list of the currently implemented grabbers.

### How to implement your own grabber

#### Create a grabber
todo (guide + example)

#### Set the grabber into the project
todo (where to put the initial links and grabber folder)
