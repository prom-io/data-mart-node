import {TransactionType} from "./TransactionType";
import {FileInfoResponse} from "./FileInfoResponse";

export interface TransactionResponse {
    id: string,
    hash: string,
    type: TransactionType,
    file: FileInfoResponse,
    dataOwner: string,
    dataMart: string,
    dataValidator: string,
    blockNumber: number,
    serviceNode: string,
    queueNumber: number,
    value: number,
    status: boolean,
    created_at: string
}
