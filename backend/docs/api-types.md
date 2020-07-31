### AccountResponse

````
{
    address: string
}
````

### FileMetadata

````
{
    briefDescription?: string,
    fullDescription?: string,
    hashTags?: string[],
    author?: string,
    userComment?: string
}
````

### FileResponse

````
{
    id: string,
     metadata: FileMetadata;
     dataValidator: string,
     dataOwner: string,
     serviceNode: string,
     extension: string,
     mimeType: string,
     size: number,
     price: number,
     name: string  
}
````

### BalancesResponse

````
{
    [address: string]: number
}
````

### TransactionsCountResponse

````
{
    count: number
}
````

### TransactionWithFileResponse 

````
{
    id: string,
    hash: string,
    file: FileResponse,
    dataOwner: string,
    dataMart: string,
    dataValidator: string,
    blockNumber: number,
    serviceNode: string,
    queueNumber: number,
    value: string,
    status: boolean,
    created_at: string
}
````

### FilePurchaseStatusResponse

````
{
    purchased: boolean,
    transaction?: TransactionWithFileResponse
}
````
