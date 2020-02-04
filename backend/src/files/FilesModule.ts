import {Module} from "@nestjs/common";
import {ScheduleModule} from "nest-schedule";
import {FilesController} from "./FilesController";
import {FilesService} from "./FilesService";
import {FilesRepository} from "./FilesRepository";
import {FilesSynchronizationScheduler} from "./FilesSynchronizationScheduler";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {DiscoveryModule} from "../discovery";
import {AccountsModule} from "../accounts";
import {Web3Module} from "../web3";

@Module({
    controllers: [
        FilesController
    ],
    providers: [
        FilesService,
        FilesRepository,
        FilesSynchronizationScheduler
    ],
    imports: [
        ScheduleModule.register(),
        ServiceNodeApiClientModule,
        DiscoveryModule,
        AccountsModule,
        Web3Module
    ],
    exports: [FilesService]
})
export class FilesModule {}
