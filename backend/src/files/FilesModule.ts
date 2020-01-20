import {Module} from "@nestjs/common";
import {ScheduleModule} from "nest-schedule";
import {FilesController} from "./FilesController";
import {FilesService} from "./FilesService";
import {FilesRepository} from "./FilesRepository";
import {FilesSynchronizationScheduler} from "./FilesSynchronizationScheduler";
import {ServiceNodeApiClientModule} from "../service-node-api";
import {DiscoveryModule} from "../discovery";

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
        DiscoveryModule
    ],
    exports: [FilesService]
})
export class FilesModule {}
