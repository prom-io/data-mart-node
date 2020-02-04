import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {AccountsService} from "./AccountsService";
import {Web3Wrapper} from "../web3";
import {config} from "../config";
import {RegisterAccountRequest} from "../model/api/request";

@Injectable()
export class InitialAccountRegistrationHandler implements OnApplicationBootstrap {
    constructor(private readonly accountService: AccountsService,
                private readonly web3Wrapper: Web3Wrapper) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        if ((await this.accountService.getAllAccounts()).length === 0) {
            const account = this.web3Wrapper.createAccountFromPrivateKey(config.INITIAL_ACCOUNT_PRIVATE_KEY);
            const registerAccountRequest: RegisterAccountRequest = new RegisterAccountRequest(
                account.address,
                config.INITIAL_ACCOUNT_PRIVATE_KEY
            );
            await this.accountService.registerAccount(registerAccountRequest);
        }
    }

}
