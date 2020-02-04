import {Injectable} from "@nestjs/common";
import Web3 from "web3";
import {Account} from "web3-core";
import {EthereumSingature} from "../model/api/request/EthereumSignature";

@Injectable()
export class Web3Wrapper {
    constructor(private readonly web3: Web3) {
    }

    public singData(data: object, privateKey: string): EthereumSingature {
        const dataJson = JSON.stringify(data);
        const dataBase64 = Buffer.from(dataJson).toString("base64");
        const signature = this.web3.eth.accounts.sign(dataBase64, privateKey);

        return {
            ...signature,
            message: signature.message!,
            messageHash: signature.messageHash!
        }
    }

    public createAccountFromPrivateKey(privateKey: string): Account {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }
}
