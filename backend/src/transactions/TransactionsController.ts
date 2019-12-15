import {Controller, Param, Query, Get} from "@nestjs/common";
import {TransactionsService} from "./TransactionsService";
import {TransactionsCountResponse, TransactionWithFileResponse} from "../model/api/response";
import {getValidPage, getValidPageSize} from "../utils/pagination";

@Controller("api/v2/transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {
    }

    @Get(":address/count")
    public countTransactionsByAddress(@Param("address") address: string): Promise<TransactionsCountResponse> {
        return this.transactionsService.countTransactionsByAddress(address);
    }

    @Get(":address")
    public getTransactionsByAddress(@Param("address") address: string,
                                     @Query("page") page: number,
                                     @Query("size") size: number): Promise<TransactionWithFileResponse[]> {
        return this.transactionsService.getTransactionsByAddress(address, getValidPage(page), getValidPageSize(size));
    }
}
