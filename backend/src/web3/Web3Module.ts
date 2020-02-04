import {Module} from "@nestjs/common";
import Web3 from "web3";
import {Web3Wrapper} from "./Web3Wrapper";

@Module({
    providers: [
        Web3Wrapper,
        {
            provide: Web3,
            useValue: new Web3()
        }
    ],
    exports: [Web3Wrapper]
})
export class Web3Module {}
