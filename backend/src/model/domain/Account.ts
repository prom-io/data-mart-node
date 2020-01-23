import {AccountType} from "./AccountType";

export interface Account {
    address: string,
    privateKey: string,
    type: AccountType
}
