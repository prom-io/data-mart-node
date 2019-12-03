import {IsString, IsNotEmpty, Matches} from "class-validator";

interface IPurchaseFileRequest {
    dataMartAddress: string
}

export class PurchaseFileRequest implements IPurchaseFileRequest {
    @IsNotEmpty({message: "Data mart address must not be empty"})
    @IsString({message: "Data mart address must be string"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Data mart address must be valid Ethereum address"
        }
    )
    public dataMartAddress: string;

    constructor(dataMartAddress: string) {
        this.dataMartAddress = dataMartAddress;
    }

    public static create(purchaseFileRequest: IPurchaseFileRequest): PurchaseFileRequest {
        return new PurchaseFileRequest(purchaseFileRequest.dataMartAddress);
    }
}
