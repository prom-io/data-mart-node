import {TransactionType} from "./TransactionType";
import {FileInfoResponse} from "./FileInfoResponse";

export interface TransactionResponse {
    id: string,
    hash: string,
    txType: TransactionType,
    file: FileInfoResponse,
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
