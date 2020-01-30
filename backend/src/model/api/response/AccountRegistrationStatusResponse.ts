import {AccountType} from "../../domain";

export interface AccountRegistrationStatusResponse {
    registered: boolean,
    role: AccountType
}
