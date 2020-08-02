import {Inject, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {AxiosInstance, AxiosPromise} from "axios";
import {
    PaginationRequest,
    ServiceNodeRegisterAccountRequest,
    ServiceNodePurchaseFileRequest, ServiceNodeWithdrawRequest
} from "../model/api/request";
import {
    BalanceResponse,
    FileResponse,
    PurchaseFileResponse,
    TransactionsCountResponse,
    TransactionResponse,
    AccountRegistrationStatusResponse
} from "../model/api/response";
import {RoundRobinLoadBalancerClient} from "../discovery";

@Injectable()
export class ServiceNodeApiClient {
    constructor(@Inject("serviceNodeApiAxios") private readonly axiosInstance: AxiosInstance,
                private readonly loadBalancerClient: RoundRobinLoadBalancerClient,
                private readonly log: LoggerService) {};

    public getFiles(paginationRequest: PaginationRequest): AxiosPromise<FileResponse[]> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/files?page=${paginationRequest.page}&size=${paginationRequest.size}`);
    }

    public purchaseFile(purchaseFileRequest: ServiceNodePurchaseFileRequest): AxiosPromise<PurchaseFileResponse> {
        return this.axiosInstance.post(`${this.getUrl()}/api/v1/purchases`, purchaseFileRequest);
    }

    public getFile(fileId: string): AxiosPromise {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/files/${fileId}`, {responseType: "stream"});
    }

    public registerAccount(serviceNodeRegisterAccountRequest: ServiceNodeRegisterAccountRequest): AxiosPromise<void> {
        return this.axiosInstance.post(`${this.getUrl()}/api/v1/accounts`, serviceNodeRegisterAccountRequest);
    }

    public getBalanceOfAccount(address: string): AxiosPromise<BalanceResponse> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/accounts/${address}/balance`);
    }

    public getTransactionsOfAddress(address: string, page: number, pageSize: number): AxiosPromise<TransactionResponse[]> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/transactions/${address}?page=${page}&pageSize=${pageSize}`);
    }

    public countTransactionsOfAddress(address: string): AxiosPromise<TransactionsCountResponse> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/transactions/${address}/count`);
    }

    public getAccountRegistrationStatus(address: string): AxiosPromise<AccountRegistrationStatusResponse> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/accounts/${address}/is-registered`);
    }

    public getBalanceOfLambdaWallet(address: string): AxiosPromise<BalanceResponse> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/accounts/lambda/${address}/balance`);
    }

    public withdrawFunds(withdrawFundsRequest: ServiceNodeWithdrawRequest): AxiosPromise<void> {
        return this.axiosInstance.post(`${this.getUrl()}/api/v1/accounts/withdraw`, withdrawFundsRequest);
    }

    public isLambdaWalletRegistered(lambdaWallet: string): AxiosPromise<Omit<AccountRegistrationStatusResponse, "role">> {
        return this.axiosInstance.get(`${this.getUrl()}/api/v1/accounts/lambda/${lambdaWallet}/is-registered`);
    }

    public getLoadBalancer(): RoundRobinLoadBalancerClient {
        return this.loadBalancerClient;
    }

    private getUrl(): string {
        const serviceNodeInstance = this.loadBalancerClient.getServiceNodeInstance();
        // this.log.debug(`Selected service node IP is ${serviceNodeInstance.ipAddress}`)
        return `http://${serviceNodeInstance.ipAddress}:${serviceNodeInstance.port}`;
    }
}
