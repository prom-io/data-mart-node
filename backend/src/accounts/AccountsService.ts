import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import uuid from "uuid";
import {AccountsRepository} from "./AccountsRepository";
import {Account, AccountType, User} from "../model/domain";
import {RegisterAccountRequest, ServiceNodeRegisterAccountRequest, WithdrawFundsRequest} from "../model/api/request";
import {AccessTokenResponse, AccountResponse, BalanceResponse, CurrentAccountResponse} from "../model/api/response";
import {ServiceNodeApiClient} from "../service-node-api";
import {Web3Wrapper} from "../web3";
import {UsersRepository} from "./UsersRepository";
import {BCryptPasswordEncoder} from "../bcrypt";
import {WalletGeneratorApiClient} from "../wallet-generator/WalletGeneratorApiClient";
import {AuthService} from "../jwt-auth/AuthService";

@Injectable()
export class AccountsService {
    constructor(private readonly accountsRepository: AccountsRepository,
                private readonly serviceNodeApiClient: ServiceNodeApiClient,
                private readonly walletGeneratorApiClient: WalletGeneratorApiClient,
                private readonly web3Wrapper: Web3Wrapper,
                private readonly usersRepository: UsersRepository,
                private readonly passwordEncoder: BCryptPasswordEncoder,
                private readonly authService: AuthService,
                private readonly log: LoggerService) {}

    public async registerAccount(registerAccountRequest: RegisterAccountRequest): Promise<AccountResponse | (AccessTokenResponse & CurrentAccountResponse)> {
        try {
            this.log.info("Trying to register account");

            let userId: string | undefined;
            let user: User | undefined;

            if (!registerAccountRequest.lambdaWallet && !registerAccountRequest.address) {
                throw new HttpException(
                    "Ether lambdaWallet or address fields must be specified",
                    HttpStatus.BAD_REQUEST
                );
            }

            if (registerAccountRequest.lambdaWallet) {
                user = await this.usersRepository.findByLambdaWallet(registerAccountRequest.lambdaWallet);

                if (user) {
                    throw new HttpException(
                        `Lambda wallet address ${registerAccountRequest.lambdaWallet} is already in use`,
                        HttpStatus.CONFLICT
                    );
                } else {
                    user = {
                        id: uuid(),
                        lambdaWallet: registerAccountRequest.lambdaWallet,
                        passwordHash: await this.passwordEncoder.encode(registerAccountRequest.password!)
                    };
                    userId = user.id;
                    const wallet = await this.walletGeneratorApiClient.generateWallet();
                    registerAccountRequest.address = wallet.address;
                    registerAccountRequest.privateKey = wallet.privateKey;
                }
            }

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
                        type: AccountType.DATA_MART,
                        userId
                    });
                } else {
                    throw new HttpException(
                        `This account has already been registered with ${accountStatus.role} status`,
                        HttpStatus.FORBIDDEN
                    )
                }
            } else {
                const serviceNodeRegisterAccountRequest: ServiceNodeRegisterAccountRequest = {
                    address: registerAccountRequest.address,
                    type: AccountType.DATA_MART,
                    lambdaWallet: registerAccountRequest.lambdaWallet,
                    signature: undefined
                };
                serviceNodeRegisterAccountRequest.signature = this.web3Wrapper.singData(
                    serviceNodeRegisterAccountRequest,
                    registerAccountRequest.privateKey
                );
                await this.serviceNodeApiClient.registerAccount(serviceNodeRegisterAccountRequest);

                if (user) {
                    await this.usersRepository.save(user);
                }

                await this.accountsRepository.save({
                    address: registerAccountRequest.address,
                    privateKey: registerAccountRequest.privateKey,
                    userId,
                    type: AccountType.DATA_MART
                });

                if (user) {
                    const {accessToken} = await this.authService.login(user);

                    return {
                        ethereumAddress: registerAccountRequest.address,
                        lambdaAddress: registerAccountRequest.lambdaWallet,
                        accessToken
                    };
                }
            }

            return {address: registerAccountRequest.address};
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.log.error("Error occurred when tried to register account");
            console.log(error);

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

    public getBalanceOfAllAccounts(user?: User): Promise<{[address: string]: number}> {
        let accountsPromise: Promise<Account[]>;

        if (user) {
            accountsPromise = this.accountsRepository.findByUser(user.id);
        } else {
            accountsPromise = this.accountsRepository.findAll();
        }

        return accountsPromise.then(accounts => {
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

    public async getCurrentAccount(user: User): Promise<CurrentAccountResponse> {
        const ethereumAccount = (await this.accountsRepository.findByUser(user.id))[0];

        return {
            ethereumAddress: ethereumAccount.address,
            lambdaAddress: user.lambdaWallet
        };
    }

    public async getBalanceOfCurrentAccount(user: User): Promise<BalanceResponse> {
        return (await this.serviceNodeApiClient.getBalanceOfLambdaWallet(user.lambdaWallet)).data;
    }

    public async withdrawFunds(withdrawFundsRequest: WithdrawFundsRequest, user: User): Promise<void> {
        const ethereumAccount = (await this.accountsRepository.findByUser(user.id))[0];
        const {balance} = (await this.serviceNodeApiClient.getBalanceOfLambdaWallet(user.lambdaWallet)).data;

        if (withdrawFundsRequest.amount > balance) {
            throw new HttpException(
                `Request was made to withdraw ${withdrawFundsRequest.amount}, but account's balance is ${balance}`,
                HttpStatus.PAYMENT_REQUIRED
            );
        }

        try {
            await this.serviceNodeApiClient.withdrawFunds({
                ethereumAddress: ethereumAccount.address,
                amount: withdrawFundsRequest.amount
            });
        } catch (error) {
            console.log(error);

            if (error.response) {
                this.log.error(`Could not withdraw funds, Service Node responded with ${error.response.status} status`);
                throw new HttpException(
                    `Could not withdraw funds, Service Node responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                this.log.error("Could not withdraw funds, Service Node is unreachable");
                throw new HttpException(
                    "Could not withdraw funds, Service Node is unreachable",
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            }
        }
    }
}
