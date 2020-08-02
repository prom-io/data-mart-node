import {LambdaTransactionType} from "./LambdaTransactionType";

export interface LambdaTransactionResponse {
    hash: string,
    type: LambdaTransactionType,
    timestamp: string,
    value: number
}
