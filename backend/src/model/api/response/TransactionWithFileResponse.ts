import {TransactionType} from "./TransactionType";
import {FileResponse} from "./FileResponse";

export interface TransactionWithFileResponse {
    id: string,
    hash: string,
    txType: TransactionType,
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
