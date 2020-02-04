import {SignedRequest} from "./SignedRequest";

export interface ServiceNodePurchaseFileRequest extends SignedRequest{
    dataMartAddress: string,
    dataValidatorAddress: string,
    fileId: string,
    dataOwnerAddress: string,
    price: number
}
