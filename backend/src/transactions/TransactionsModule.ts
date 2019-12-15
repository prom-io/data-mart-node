import {Module} from "@nestjs/common";
import {TransactionsController} from "./TransactionsController";
import {TransactionsService} from "./TransactionsService";
import {FilesModule} from "../files";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [FilesModule]
})
export class TransactionsModule {}
