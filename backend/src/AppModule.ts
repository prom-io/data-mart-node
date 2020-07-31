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
import {EncryptorServiceModule} from "./encryptor";
import {BCryptModule} from "./bcrypt";
import {WalletGeneratorModule} from "./wallet-generator";
import {AuthModule} from "./jwt-auth";

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
      Web3Module,
      EncryptorServiceModule,
      BCryptModule,
      WalletGeneratorModule,
      AuthModule
  ]
})
export class AppModule {}
