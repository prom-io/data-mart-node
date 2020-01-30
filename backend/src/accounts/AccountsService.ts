import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {AccountsRepository} from "./AccountsRepository";
import {AccountType} from "../model/domain";
import {RegisterAccountRequest} from "../model/api/request";
import {AccountResponse, BalanceResponse} from "../model/api/response";
import {ServiceNodeApiClient} from "../service-node-api";

@Injectable()
export class AccountsService {
    constructor(private readonly accountsRepository: AccountsRepository,
                private readonly serviceNodeApiClient: ServiceNodeApiClient,
                private readonly log: LoggerService) {}

    public async registerAccount(registerAccountRequest: RegisterAccountRequest): Promise<AccountResponse> {
        try {
            this.log.info("Trying to register account");

            const existingAccounts = await this.accountsRepository.findAll();

            if (existingAccounts.map(account => account.address).includes(registerAccountRequest.address)) {
                throw new HttpException(
                    `Account with ${registerAccountRequest.address} has already been registered`,
                    HttpStatus.CONFLICT
                );
            }

            const accountStatus = (await this.serviceNodeApiClient.getAccountRegistrationStatus(registerAccountRequest.address)).data;

            if (accountStatus.registered) {
                if (accountStatus.role === AccountType.DATA_MART) {
                    await this.accountsRepository.save({
                        address: registerAccountRequest.address,
                        privateKey: registerAccountRequest.privateKey,
                        type: AccountType.DATA_MART
                    });
                } else {
                    throw new HttpException(
                        `This account has already been registered with ${accountStatus.role} status`,
                        HttpStatus.FORBIDDEN
                    )
                }
            } else {
                await this.serviceNodeApiClient.registerAccount({
                    address: registerAccountRequest.address,
                    type: AccountType.DATA_MART
                });
                await this.accountsRepository.save({
                    address: registerAccountRequest.address,
                    privateKey: registerAccountRequest.privateKey,
                    type: AccountType.DATA_MART
                });
            }

            return {address: registerAccountRequest.address};
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.log.error("Error occurred when tried to register account");

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
