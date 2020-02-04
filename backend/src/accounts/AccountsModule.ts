import {Module} from "@nestjs/common";
import {AccountsController} from "./AccountsController";
import {AccountsService} from "./AccountsService";
import {AccountsRepository} from "./AccountsRepository";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {Web3Module} from "../web3";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService, AccountsRepository],
    imports: [ServiceNodeApiClientModule, Web3Module],
    exports: [AccountsService, AccountsRepository]
})
export class AccountsModule {}
