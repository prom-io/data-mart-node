import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AccountsRepository} from "./AccountsRepository";
import {AccountType} from "../model/domain";
import {RegisterAccountRequest} from "../model/api/request";
import {AccountResponse, BalanceResponse} from "../model/api/response";
import {ServiceNodeApiClient} from "../service-node-api";
import {LoggerService} from "nest-logger";

@Injectable()
export class AccountsService {
    constructor(private readonly accountsRepository: AccountsRepository,
                private readonly serviceNodeApiClient: ServiceNodeApiClient,
                private readonly log: LoggerService) {}

    public async registerAccount(registerAccountRequest: RegisterAccountRequest): Promise<AccountResponse> {
        try {
            this.log.info("Trying to register account");
            await this.serviceNodeApiClient.registerAccount({
                address: registerAccountRequest.address,
                type: AccountType.DATA_MART
            });
            await this.accountsRepository.save({
                address: registerAccountRequest.address,
                type: AccountType.DATA_MART
            });
            return {address: registerAccountRequest.address};
        } catch (error) {
            console.log(error);
            this.log.error("Error occurred when tried to register account");
            this.log.debug(error);

            if (error.response) {
                throw new HttpException(
                    `Could not register account, service node responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException("Error occurred when tried to register account", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getAllAccounts(): Promise<AccountResponse[]> {
        return (await this.accountsRepository.findAll())
            .map(account => ({address: account.address}));
    }

    public async getBalanceOfAccount(address: string): Promise<BalanceResponse> {
        return (await this.serviceNodeApiClient.getBalanceOfAccount(address)).data;
    }

    public getBalanceOfAllAccounts(): Promise<{[address: string]: number}> {
        return this.accountsRepository.findAll().then(accounts => {
            const result: {[address: string]: number} = {};
            return Promise.all(accounts.map(async account => ({
                address: account.address,
                balance: (await this.getBalanceOfAccount(account.address)).balance
            })))
                .then(balances => {
                    balances.forEach(balance => result[balance.address] = balance.balance);
                    return result;
                })
        })
    }
}
