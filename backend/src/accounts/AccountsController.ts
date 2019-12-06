import {Controller, Get, Post, Body} from "@nestjs/common";
import {AccountsService} from "./AccountsService";
import {AccountResponse, BalancesResponse} from "../model/api/response";
import {RegisterAccountRequest} from "../model/api/request";

@Controller("api/v2/accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    public registerAccount(@Body() registerAccountRequest: RegisterAccountRequest): Promise<AccountResponse> {
        return this.accountsService.registerAccount(registerAccountRequest);
    }

    @Get()
    public getAllAccounts(): Promise<AccountResponse[]> {
        return this.accountsService.getAllAccounts();
    }

    @Get("balances")
    public getBalancesOfAllAccounts(): Promise<BalancesResponse> {
        return new Promise((resolve, reject) => {
            this.accountsService.getBalanceOfAllAccounts()
                .then(response => resolve(response))
                .catch(error => {
                    console.log(error);
                    reject(error);
                })
        })
    }
}
