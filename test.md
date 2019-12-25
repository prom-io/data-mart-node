# How to test Data Mart Node with UI

## Table of contents

- [Description](#description)
- [1. Explore Data Owners' files / metadata](#explore-data-owners-info)
- [2. Purchase Data Owners' files](#data-owners-info-purchase)
- [3. Browse the purchase trancastions list](#purchase-trancastions-list)
- [4. Registration of the wallet](#wallet-registration)


## Description

Data Mart node is an application which is used for purchasing data and proceeding it to the buyer (end user: some brand or agency outside the System). Purpose of the test is to illustrate the work of core functions of Data Mart.

Here you can find the [sequence diagram](https://github.com/Prometeus-Network/prometeus/wiki/Data-Purchase-Diagram) illustrates the data purchase process and it's actors.

## Explore Data Owners Info

'EXPLORE FILES' item of the left menu will display the full list of the Data Owners' files, provided by Data Validators and available for purchase. 

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/explore1.png" alt="Data owners browsing">

You can search the files for exact keywords or click on the tags to filter the files' list.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/explore1a.png" alt="Data owners tags">

Clicking on the expand icon (on the upper right corner of each Data Owner's box) will display expanded view of the file's info with all available medatdata.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/purchase1.png" alt="Data owners expanded">

NOTE: To test the full process of create and purchase the Data Owner's file you must go to [Data Validator UI](http://178.128.240.29/data-sales) to create the new Data Owner's files (see [testing manual](https://github.com/Prometeus-Network/data-validator-node/blob/master/test.md)). You could have to wait up to 10 minutes before you can see recently created Data Owner on the list in Data Mart's 'Explore Files' page due the decentralized nature of the System.

## Data Owners' info Purchase

Clicking on the 'PURCHASE' button will start the purchase process. All the buttons will be disabled until the purchase will be accomplished (it can take up to 3 minutes). File's price will be written off from your balance.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/purchase2.png" alt="Purchasing file">

When the file is purchased and transaction is completed, all the transaction details will be displayed and the file will be downloaded. The same info will be viewed later if you will try to purchase the same file again (you'll be able to download the cached file via 'REGAIN FILE' button).

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/purchase3.png" alt="Purchased file">

The [transaction](https://github.com/Prometeus-Network/prometeus/blob/master/docs/transaction2.png) is also viewable in [Prom Blockchain explorer](http://178.62.211.224/).

## Purchase trancastions list

All the transactions concerning the Data Owners, which were purchased using the default wallet.
You can choose another default wallet (see list of registered wallets) with the dropdown control above the Data Purchases' grid. It will show you the the list of Data Owners, purchased using that wallet.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/purchases1.png" alt="Purchased file">

All the transactions are also viewable in [Prom Blockchain explorer](http://178.62.211.224/).

## Wallet Registration

Please register the wallet on the 'Register' page to asscoiate it with the this instance of Data Mart Node. You could chooose it as a default wallet later and use it to buy Data Owners' files.

