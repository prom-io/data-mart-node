import {SignedRequest} from "./SignedRequest";
import {AccountType} from "../../domain";

export interface ServiceNodeRegisterAccountRequest extends SignedRequest {
    address: string,
    lambdaWallet?: string,
    type: AccountType
}
