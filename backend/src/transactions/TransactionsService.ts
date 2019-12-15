import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {FilesService} from "../files";
import {ServiceNodeApiClient} from "../service-node-api";
import {FileResponse, TransactionResponse, TransactionsCountResponse, TransactionWithFileResponse} from "../model/api/response";
import {LoggerService} from "nest-logger";

@Injectable()
export class TransactionsService {
    constructor(private readonly filesService: FilesService, 
                private readonly serviceNodeApiClient: ServiceNodeApiClient,
                private readonly log: LoggerService) {
    }
    
    public async countTransactionsByAddress(address: string): Promise<TransactionsCountResponse> {
        try {
            return (await this.serviceNodeApiClient.countTransactionsOfAddress(address)).data;
        } catch (error) {
            this.log.error("Error occurred when tried to execute count transactions request");
            this.log.error(error.trace);

            let errorMessage: string = "";

            if (error.response) {
                this.log.error(`Service node responded with ${error.response.status} status`);
                errorMessage = `Could not count transactions by address, service node responded with ${error.response.status} status`;
            } else {
                errorMessage = "Service node is unreachable";
            }

            throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getTransactionsByAddress(address: string, page: number, pageSize: number): Promise<TransactionWithFileResponse[]> {
        try {
            const transactions: TransactionResponse[] = (await this.serviceNodeApiClient.getTransactionsOfAddress(address, page, pageSize)).data;
            const transactionsWithFile: TransactionWithFileResponse[] = [];

            for (const transaction of transactions) {
                const file: FileResponse = await this.filesService.getFileInfoById(transaction.id);
                transactionsWithFile.push({
                    ...transaction,
                    file
                });
            }
            return transactionsWithFile;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
