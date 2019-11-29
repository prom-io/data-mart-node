# Data mart node

## Table of contents

- [Description](#description)
- [How it works](#how-it-works)
- [How to run](#how-to-run)
    - [Prerequisites](#prerequisites)
    - [Build and run process](#build-and-run-process)

## Description

Data mart node is an application which is used by Data mart. 
It exposed API for registering Data mart account, purchasing and downloading data, 
as well as retrieving available files.

In future it will also have a client application which will consume above-mentioned API.

## How it works

Data Mart node is a Node.js application built with Nest.js. It communicates with 
[Service node](https://github.com/Prometeus-Network/service-node_net) and uses its API
to synchronize, purchase and download files. 

Files synchronization is done by periods (every 10th minute by default). The information about
files is stored in Elasticsearch.

## How to run

### Prerequisites

In order to run Data mart node, you need to install:

- Node.js. You can find installation instructions [here](https://nodejs.org/en/download/)
- Elasticsearch, which can be found [here](https://www.elastic.co/downloads/elasticsearch)

### Build and run process

- Start Elasticsearch
- In order to run backend API, navigate to `backend` folder and do the following:
  - Create and configure `.env` file with the following variables:
    - `SERVICE_NODE_API_URL` - the URL of Service node to communicate with
    - `ELASTIC_SEARCH_HOST_URL` - the URL of Elasticsearch
    - `PORT` - the port number which will be used by application
    - `LOGGING_LEVEL` - logging verbosity level. Available values are `trace`, `debug`, `info`, `warning`, `error`
    - `FILES_SYNCHRONIZATION_CRON` - cron expression which determines how often the information about files is synchronized with service node
  - `npm install` to install all required dependencies
  - `npm run start` to start the application
