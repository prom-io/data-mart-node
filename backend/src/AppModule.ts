import {Module} from "@nestjs/common";
import {FilesModule} from "./files";
import {ServiceNodeApiClientModule} from "./service-node-api";
import {LoggerModule} from "./logging";
import {ElasticsearchContainerModule} from "./elasticsearch";
import {ElasticsearchInitializerModule} from "./elasticsearch/initializer";
import {AccountsModule} from "./accounts";
import {TransactionsModule} from "./transactions";
import {DiscoveryModule} from "./discovery";
import {Web3Module} from "./web3";

@Module({
  imports: [
      DiscoveryModule,
      ElasticsearchContainerModule,
      ElasticsearchInitializerModule,
      FilesModule,
      ServiceNodeApiClientModule,
      LoggerModule,
      AccountsModule,
      TransactionsModule,
      Web3Module
  ]
})
export class AppModule {}
