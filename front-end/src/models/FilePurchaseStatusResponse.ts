import {TransactionResponse} from "./TransactionResponse";

export interface FilePurchaseStatusResponse {
    purchased: boolean,
    transaction?: TransactionResponse
}
