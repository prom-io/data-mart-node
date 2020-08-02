# Transactions API

## Table of contents

- [Get transactions by address](#get-transactions-by-address)
- [Get transactions count by address](#get-transactions-count-by-address)
- [Get file purchase status](#get-file-purchase-status)

### Get transactions by address

Returns transactions of specified address

#### HTTP Request

````
GET /api/v2/transactions/:address?page={page}&size={size}
````

Pagination starts with `0`.

#### Response type

Returns array of [TransactionResponse](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#transactionresponse) objects

### Get transactions count by address

Returns number of transactions by address

#### HTTP Request

````
GET /api/v2/transactions/:address/count
````

#### Response type

Returns object with the following structure:

````
{
    count: number
}
````

### Get file purchase status

Check whether file has been purchased by user

#### HTTP Request

````
GET /api/v2/transactions/:address/puchase-status/:fileId
````

#### Response type

Returns [FilePurchaseStatusResponse](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#filepurchasestatus) object

