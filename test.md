# How to test Data Mart Node with UI

## Table of contents

- [Description](#description)
- [1. Explore Data Owners' files / metadata](#explore-data-owners-info)
- [2. Purchase Data Owners' files](#data-owners-info-purchase)
- [3. Browse the purchase trancastions list](#how-to-prolomg-the-storage-term)
- [4. Registration of the wallet](#wallet-registration)


## Description

Data Mart node is an application which is used for purchasing data and proceeding it to the buyer (end user: some brand or agency outside the System). Purpose of the test is to illustrate the work of core functions of Data Mart.

Here you can find the [sequence diagram](https://github.com/Prometeus-Network/prometeus/wiki/Data-Purchase-Diagram) illustrates the data purchase process and it's actors.


## Explore Data Owners Info

The home screen of Data Mart is the full list of the Data Owners' files, provided by Data Validators and available for purchase. 

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/explore1.png" alt="Data owners browsing">

You can search the files for exact keywords or click on the tags to filter the files' list.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/explore1a.png" alt="Data owners tags">

Clicking on the expand icon (on the upper right corner of each Data Owner's box) will display expanded view of the file's info with all available medatdata.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/purchase1.png" alt="Data owners expanded">


NOTE: To test the full process of create and purchase the Data Owner's file you must go to [Data Validator UI](http://178.128.240.29/data-sales) to create the new Data Owner's files (see [testing manual](https://github.com/Prometeus-Network/data-validator-node/blob/master/test.md)). You could have to wait up to 10 minutes before you can see recently created Data Owner on the list in Data Mart's 'Explore Files' page due the decentralized nature of the System.



