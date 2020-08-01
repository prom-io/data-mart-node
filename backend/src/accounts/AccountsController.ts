import {Controller, Get, Post, Body, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {AccountsService} from "./AccountsService";
import {AccessTokenResponse, AccountResponse, BalanceResponse, BalancesResponse, CurrentAccountResponse} from "../model/api/response";
import {RegisterAccountRequest, WithdrawFundsRequest} from "../model/api/request";
import {User} from "../model/domain";

@Controller("api/v2/accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    public registerAccount(@Body() registerAccountRequest: RegisterAccountRequest): Promise<AccountResponse | (CurrentAccountResponse & AccessTokenResponse)> {
        return this.accountsService.registerAccount(registerAccountRequest);
    }

    @Get()
    public getAllAccounts(): Promise<AccountResponse[]> {
        return this.accountsService.getAllAccounts();
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("current")
    public getCurrentAccount(@Req() request: Request): Promise<CurrentAccountResponse> {
        return this.accountsService.getCurrentAccount((request as any).user as User);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("current/balance")
    public getBalanceOfCurrentAccount(@Req() request: Request): Promise<BalanceResponse> {
        return this.accountsService.getBalanceOfCurrentAccount((request as any).user as User);
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

    @UseGuards(AuthGuard("jwt"))
    @Post("withdraw")
    public withdrawFunds(@Body() withdrawFundsRequest: WithdrawFundsRequest,
                         @Req() request: Request): Promise<void> {
        return this.accountsService.withdrawFunds(withdrawFundsRequest, (request as any).user as User);
    }
}
