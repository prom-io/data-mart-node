# Files API

## Table of contents

- [File purchase process](#file-purchase-process)
- [Search files](#search-files)
- [Get file info by ID](#get-file-info-by-id)
- [Purchase file](#purchase-file)
- [Download file](#download-file)
- [Regain file](#regain-file)

### File purchase process

- Before making purchase request, check whether file has already been purchased 
calling [Get file purchase status](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/transactions.md#get-file-purchase-status) 
method
  - If file has been purchased before, call [Regain file](#regain-file) method
- Make request to [Purchase file](#purchase-file)
- [Download file](#download-file)

### Search files

Performs search of files

#### HTTP request

````
GET /api/v2/files/search?page={page}&size={size}&query={query}&tags={tags}
````

Pagination starts with `1`.

Tags are passed as JSON-formatted array of strings.

#### Response type

Returns array of [FileResponse](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#fileresponse) objects

### Get file info by ID

Returns file info by ID

#### HTTP Request

````
GET /api/v2/files/:fileId/info
````

#### Response type

Returns [FilePurchaseStatus](https://github.com/Prometeus-Network/data-mart-node/blob/master/backend/docs/api-types.md#filepurchase) object

### Purchase file 

Performs purchasing of file.

#### HTTP Request

````
POST /api/v2/files/:fileId/purchase
````

#### Request body

Request accepts the following body:

````
{
    dataMartAddress: string //Ethereum address of data mart
}
````

#### Response type

Returns empty response

### Download file

Downloads file with the specified ID. If file has been purchased by current user, 
it will be decrypted.

#### HTTP Request

````
GET /api/v2/files/:fileId
````

#### Response type

Returns a binary file.

### Regain file

Acts same as [download file](#download-file) endpoint.

Downloads file with the specified ID. If file has been purchased by current user,
it will be decrypted.

#### HTTP Request

````
GET /api/v2/files/:fileId/regain
````

#### Response type

Returns a binary file.

