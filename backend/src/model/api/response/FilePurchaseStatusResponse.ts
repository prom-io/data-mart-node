import {TransactionResponse} from "./TransactionResponse";
import {TransactionWithFileResponse} from "./TransactionWithFileResponse";

export interface FilePurchaseStatusResponse {
    purchased: boolean,
    transaction?: TransactionWithFileResponse
}
