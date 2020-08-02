# Accounts API

## Table of contents

- [Create new data mart account](#create-new-data-mart-account)
- [Get current account](#get-current-account)
- [Get balance of current account](#get-balance-of-current-account)

### Create new data mart account

Creates new data validator account

#### HTTP Request

````
POST /api/v2/accounts
````

#### Request body type

````
{
    lambdaWallet: string,
    password: string,
    passwordConfirmation: string
}
````

#### Response type

Returns empty response

### Get current account

#### HTTP Request

````
GET /api/v2/accounts/current
````

#### Response type

Returns [CurrentAccountResponse](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#currentaccountresponse) object

### Get balance of current account

Returns balance of currently logged in data validator account with the specified balance.
Requires JWT token to be present in headers.

#### HTTP Request

````
GET /api/v2/accounts/current/balance
````

#### Response type

Returns [BalanceResponse](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#balanceresponse) object

