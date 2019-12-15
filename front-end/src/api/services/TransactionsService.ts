import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {COUNT, TRANSACTIONS} from "../endpoints";
import {TransactionResponse} from "../../models";

export class TransactionsService {
    public static getTransactionsByAddress(address: string, page: number, size: number): AxiosPromise<TransactionResponse[]> {
        return axiosInstance.get(`/${TRANSACTIONS}/${address}?page=${page}&size=${size}`);
    }

    public static countTransactionsByAddress(address: string): AxiosPromise<{count: number}> {
        return axiosInstance.get(`/${TRANSACTIONS}/${address}/${COUNT}`);
    }
}
