import {Global, Module} from "@nestjs/common";
import Axios from "axios";
import {ServiceNodeApiClient} from "./ServiceNodeApiClient";
import {DiscoveryModule} from "../discovery";

@Global()
@Module({
    providers: [
        {
            provide: "serviceNodeApiAxios",
            useValue: Axios.create({
                timeout: Number.MAX_SAFE_INTEGER
            })
        },
        ServiceNodeApiClient
    ],
    imports: [
        DiscoveryModule
    ],
    exports: [
        ServiceNodeApiClient
    ]
})
export class ServiceNodeApiClientModule {}
