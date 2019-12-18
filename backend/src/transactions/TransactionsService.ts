import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {FilesService} from "../files";
import {ServiceNodeApiClient} from "../service-node-api";
import {
    FilePurchaseStatusResponse,
    FileResponse,
    TransactionResponse,
    TransactionsCountResponse,
    TransactionWithFileResponse
} from "../model/api/response";
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

    public async checkFilePurchaseStatus(fileId: string, dataMartAddress: string): Promise<FilePurchaseStatusResponse> {
        const file = await this.filesService.getFileInfoById(fileId);
        let fetchedAllTransactions = false;
        let transactionFound = false;
        let targetTransaction: TransactionResponse | undefined;
        let currentPage = 0;
        const pageSize = 100;

        while (!fetchedAllTransactions || !transactionFound) {
            let transactions = (await this.serviceNodeApiClient.getTransactionsOfAddress(dataMartAddress, currentPage, pageSize)).data;

            if (transactions.length === 0) {
                fetchedAllTransactions = true;
                break;
            }

            transactions = transactions.filter(transaction => transaction.dataMart === dataMartAddress && transaction.id === fileId);

            if (transactions.length !== 0) {
                targetTransaction = transactions[0];
                transactionFound = true;
                break;
            }

            currentPage += 1;
        }

        if (transactionFound) {
            return {
                purchased: true,
                transaction: {
                    ...targetTransaction!,
                    file
                }
            }
        } else {
            return {
                purchased: false
            }
        }
    }
}
