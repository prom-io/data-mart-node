import {Module} from "@nestjs/common";
import {ScheduleModule} from "nest-schedule";
import {FilesController} from "./FilesController";
import {FilesService} from "./FilesService";
import {FilesRepository} from "./FilesRepository";
import {FileKeysRepository} from "./FileKeysRepository";
import {FilesSynchronizationScheduler} from "./FilesSynchronizationScheduler";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {DiscoveryModule} from "../discovery";
import {AccountsModule} from "../accounts";
import {Web3Module} from "../web3";
import {EncryptorServiceModule} from "../encryptor";

@Module({
    controllers: [
        FilesController
    ],
    providers: [
        FilesService,
        FilesRepository,
        FileKeysRepository,
        FilesSynchronizationScheduler
    ],
    imports: [
        ScheduleModule.register(),
        ServiceNodeApiClientModule,
        DiscoveryModule,
        AccountsModule,
        Web3Module,
        EncryptorServiceModule
    ],
    exports: [FilesService]
})
export class FilesModule {}
