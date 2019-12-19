# Data Mart Node

## Table of contents

- [Description](#description)
- [License](#license)
- [How it works](#how-it-works)
- [How to run](#how-to-run)
    - [Prerequisites](#prerequisites)
    - [Build and run process](#build-and-run-process)
        - [Running inside Docker](#running-inside-docker)
        - [Running outside Docker](#running-outside-docker)
    - [Environmental variables](#environmental-variables)
        - [Bakcend](#backend)
        - [Front-end](#front-end)
- [How to test](#how-to-test)
- [Stages of project](#stages-of-project)
    - [What Data Mart node can do now](#what-data-mart-node-can-do-now)
    - [What Data mart node will do in the future](#what-data-mart-node-will-do-in-the-future)


## Description

Data Mart node is an application which is used for purchasing data and proceeding it to 
the buyer (end user: some brand or agency outside the System). 
It allows to browse metadata (via special UI) and purchase any Data Owners’ data 
within the System using API of Service Node. Besides that, Data Validator Node makes final decryption of the data.
 
The Node performs synchronization of information about uploaded files at regular intervals (every 10th minute by default) 
using Service Node API for that. The information is saved to Elasticsearch 
and becomes available to Data Marts via RESTful API or user interface. 
Upon data purchasing, Data Mart node makes request to Service Node which processes payment, 
and then makes another request to download purchased file.


## License

Prometeus Network is licensed under the Apache software license (see LICENSE [file](https://github.com/Prometeus-Network/prometeus/blob/master/LICENSE)). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either \express or implied.

Prometeus Network makes no representation or guarantee that this software (including any third-party libraries) will perform as intended or will be free of errors, bugs or faulty code. The software may fail which could completely or partially limit functionality or compromise computer systems. If you use or implement it, you do so at your own risk. In no event will Prometeus Network be liable to any party for any damages whatsoever, even if it had been advised of the possibility of damage.

As such this codebase should be treated as experimental and does not contain all currently developed features. Prometeus Network will be delivering regular updates.

## How it works

Upon starting, Data Mart node performs the following steps:
 - Backend API startup
   - Elasticsearch initialization and indixes creation;
   - Initial synchronization of information about all files uploaded to Prometeus Network via Service Node API and saving this
   information to Elasticsearch;
 - Client application startup

After startup, Data Mart node exposes RESTful API which allows to perform the following operations:
- Files search
- Purchasing and downloading files
- Account registration
- Transactions history view

## How to run

### Prerequisites

In order to run Data Mart node, you have to install:
- Latest NodeJS version, which can be found on the [official website](https://nodejs.org/en/download/current/)
- Docker. You can find installation instructions on [official website](https://docs.docker.com/install/)
- Docker-compose, which can be found [here](https://docs.docker.com/compose/install/)

### Build and run process

Firstly, you need to clone this repository with the following command:

```git clone https://github.com/Prometeus-Network/data-mart-node.git```

After repository is cloned, you need to initialize submodules with the following commands:

```git submodule init```

```git submodule update```

#### Running inside Docker

In order to run Data Mart node inside Docker container, you need to do the following:

- While in project directory, run the following command:

```docker-compose up --build``` or ```docker-compose up --build -d``` if you want to run the application in detached mode.

#### Running outside Docker

If you want to run Data Mart node outside Docker, you will need to to the following:

- Elasticsearch and Kibana
  - Install Java 8. You can find instructions on [official website](#https://openjdk.java.net/install/)
  - Install Elasticsearch 6.4.0. Instructions can be found on [official website](#https://www.elastic.co/downloads/past-releases/elasticsearch-6-4-0)
  - Install Kibana 6.4.0
  - Start Elasticsearch and Kibana
- Backend API
  - Go to `backend` directory and run `npm istall` command to install all dependencies for backend application
  - Create `.env` file and configure it with the variables described [below](#backend)
  - Run `npm run start` to start up backend applicationd
- Client application
  - Go to `front-end` directory and run `npm run start` command to install all dependencies for front-end application
  - Create `.env` file and configure it with the variables described [below](#front-end)
  - Run `npm run production` to start up client application


### Environmental variables

#### Backend 

| Variable                   | Description                                                                             |
|----------------------------|-----------------------------------------------------------------------------------------|
| SERVICE_NODE_API_URL       | URL of Service node API                                                                 |
| ELASTICSERACH_HOST_URL     | URL of Elasticsearch                                                                    |
| KIBANA_HOST_URL            | URL of Kibana                                                                           |
| PORT                       | Port which will be used by backend API                                                  |
| LOGGING_LEVEL              | Level of logging verbosity. Allowed values are trace, debug, info, warning, error       |
| FILES_SYNCRHONIZATION_CRON | Cron expression which determines how often information about files will be synchronized |



#### Front-end

| Variable                              | Description                                                      |
|---------------------------------------|------------------------------------------------------------------|
| REACT_APP_DATA_MART_NODE_API_BASE_URL | URL of backend API                                               |
| REACT_APP_PRODUCTION_PORT             | Port which will be used by client application in production mode |


## How to test

Demo client application can be found [here](http://178.62.207.53:3008/)

## Stages of project

### What Data Mart node can do now

- It synchronizes information about files uploaded to Promenteus network using Service Node API and saves it to Elasticsearch;
- It allows Data Mart to search files;
- It allows Data Mart to buy a file, and also caches purchased files locally;

### What Data Mart node will do in the future


