import Web3 from "web3"
import {isStringEmpty} from "../../utils";
import {AccountType} from "../../models";

export const validatePrivateKey = (address: string, web3: Web3, privateKey?: string): string | undefined => {
    if (isStringEmpty(privateKey)) {
        return "Private key is required"
    }

    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey!);

        if (account.address !== address) {
            return "Invalid private key";
        }

        return undefined;
    } catch (error) {
        return "Invalid private key";
    }
};

export const validateAccountType = (accountType?: string): string | undefined => {
    if (isStringEmpty(accountType)) {
        return "Account type is required"
    }

    if (Object.keys(AccountType).find(key => key === accountType) === undefined) {
        return "Invalid account type"
    }
};
