import {Module} from "@nestjs/common";
import {AccountsController} from "./AccountsController";
import {AccountsService} from "./AccountsService";
import {AccountsRepository} from "./AccountsRepository";
import {InitialAccountRegistrationHandler} from "./InitialAccountRegistrationHandler";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {Web3Module} from "../web3";
import {ElasticsearchInitializerModule} from "../elasticsearch/initializer";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService, AccountsRepository, InitialAccountRegistrationHandler],
    imports: [ServiceNodeApiClientModule, Web3Module, ElasticsearchInitializerModule],
    exports: [AccountsService, AccountsRepository]
})
export class AccountsModule {}
