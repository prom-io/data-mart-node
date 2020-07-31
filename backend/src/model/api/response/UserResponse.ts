import {AccountResponse} from "./AccountResponse";

export interface UserResponse {
    id: string,
    lambdaWallet: string,
    ethereumAccounts: AccountResponse[]
}
