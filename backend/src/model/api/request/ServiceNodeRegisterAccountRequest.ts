import {AccountType} from "../../domain";

export interface ServiceNodeRegisterAccountRequest {
    address: string,
    type: AccountType
}
