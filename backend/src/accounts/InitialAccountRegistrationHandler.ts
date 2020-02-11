import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import Timeout = NodeJS.Timeout;
import {clearInterval} from "timers";
import {AccountsService} from "./AccountsService";
import {Web3Wrapper} from "../web3";
import {config} from "../config";
import {RegisterAccountRequest} from "../model/api/request";
import {ElasticsearchInitializer} from "../elasticsearch/initializer";

@Injectable()
export class InitialAccountRegistrationHandler implements OnApplicationBootstrap {
    private initialAccountRegistrationIntervalId: Timeout;

    constructor(private readonly accountService: AccountsService,
                private readonly web3Wrapper: Web3Wrapper,
                private readonly elasticsearchInitializer: ElasticsearchInitializer,
                private readonly loggerService: LoggerService) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        this.loggerService.info("Checking if this node has accounts");
        if (this.elasticsearchInitializer.areIndexesInitialized()) {
            if ((await this.accountService.getAllAccounts()).length === 0) {
                this.loggerService.info("Registering initial account");
                const account = this.web3Wrapper.createAccountFromPrivateKey(config.INITIAL_ACCOUNT_PRIVATE_KEY);
                const registerAccountRequest: RegisterAccountRequest = new RegisterAccountRequest(
                    account.address,
                    config.INITIAL_ACCOUNT_PRIVATE_KEY
                );
                await this.accountService.registerAccount(registerAccountRequest);
                this.loggerService.info(`Registered initial account with ${account.address} address`);
            } else {
                this.loggerService.info("This node has registered accounts, skipping initial account creation");
            }
            clearInterval(this.initialAccountRegistrationIntervalId);
        } else {
            this.loggerService.info("Elasticsearch indexes have not been initialized yet, retrying initial account registration in 3 seconds");
            this.initialAccountRegistrationIntervalId = setInterval(() => this.onApplicationBootstrap(), 3000);
        }
    }

}
