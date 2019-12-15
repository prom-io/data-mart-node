import {Inject, Injectable} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {
    PaginationRequest,
    ServiceNodeRegisterAccountRequest,
    ServiceNodePurchaseFileRequest
} from "../model/api/request";
import {BalanceResponse, FileResponse, PurchaseFileResponse, TransactionsCountResponse, TransactionResponse} from "../model/api/response";

@Injectable()
export class ServiceNodeApiClient {
    constructor(@Inject("serviceNodeApiAxios") private readonly axiosInstance: AxiosInstance) {};

    public getFiles(paginationRequest: PaginationRequest): AxiosPromise<FileResponse[]> {
        return this.axiosInstance.get(`/api/v1/files?page=${paginationRequest.page}&size=${paginationRequest.size}`);
    }

    public purchaseFile(purchaseFileRequest: ServiceNodePurchaseFileRequest): AxiosPromise<PurchaseFileResponse> {
        return this.axiosInstance.post("/api/v1/purchases", purchaseFileRequest);
    }

    public getFile(fileId: string): AxiosPromise<any> {
        return this.axiosInstance.get(`/api/v1/files/${fileId}`, {responseType: "stream"});
    }

    public registerAccount(serviceNodeRegisterAccountRequest: ServiceNodeRegisterAccountRequest): AxiosPromise<void> {
        return this.axiosInstance.post("/api/v1/accounts", serviceNodeRegisterAccountRequest);
    }

    public getBalanceOfAccount(address: string): AxiosPromise<BalanceResponse> {
        return this.axiosInstance.get(`/api/v1/accounts/${address}/balance`);
    }

    public getTransactionsOfAddress(address: string, page: number, pageSize: number): AxiosPromise<TransactionResponse[]> {
        return this.axiosInstance.get(`/api/v1/transactions/${address}?page=${page}&pageSize=${pageSize}`);
    }

    public countTransactionsOfAddress(address: string): AxiosPromise<TransactionsCountResponse> {
        return this.axiosInstance.get(`/api/v1/transactions/${address}/count`);
    }
}
