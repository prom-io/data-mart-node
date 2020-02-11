import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {FILES_V2, INFO, PURCHASE, PURCHASE_STATUS, REGAIN, SEARCH, TRANSACTIONS} from "../endpoints";
import {FileInfoResponse, FilePurchaseStatusResponse, PurchaseFileRequest, PurchaseFileResponse} from "../../models";

export class DataPurchaseService {
    public static findAllFiles(): AxiosPromise<FileInfoResponse[]> {
        return axiosInstance.get(`/${FILES_V2}`);
    }

    public static searchFiles(query: string, page: number, pageSize: number): AxiosPromise<FileInfoResponse[]> {
        return axiosInstance.get(`/${FILES_V2}/${SEARCH}?query=${query}&page=${page}&size=${pageSize}`);
    }

    public static searchFilesByQueryAndTags(query: string, tags: string[], page: number, pageSize: number): AxiosPromise<FileInfoResponse[]> {
        const tagsStringified = JSON.stringify(tags);
        return axiosInstance.get(`/${FILES_V2}/${SEARCH}/?query=${query}&tags=${tagsStringified}&page=${page}&size=${pageSize}`);
    }

    public static findFilesOfDataValidator(dataValidatorAddress: string): AxiosPromise<FileInfoResponse[]> {
        return axiosInstance.get(`/${FILES_V2}?dataValidator=${dataValidatorAddress}`);
    }

    public static getFileInfoById(fileId: string): AxiosPromise<FileInfoResponse> {
        return axiosInstance.get(`/${FILES_V2}/${fileId}/${INFO}`);
    }

    public static downloadFile(fileId: string): AxiosPromise<Blob> {
        return axiosInstance.get(`/${FILES_V2}/${fileId}`, {responseType: "blob"});
    }

    public static purchaseFile(fileId: string, purchaseFileRequest: PurchaseFileRequest): AxiosPromise<PurchaseFileResponse> {
        return axiosInstance.post(`/${FILES_V2}/${fileId}/${PURCHASE}`, purchaseFileRequest);
    }

    public static regainFile(fileId: string): AxiosPromise<void> {
        return axiosInstance.get(`/${FILES_V2}/${fileId}/${REGAIN}`, {responseType: "blob"});
    }

    public static checkFilePurchaseStatus(dataMartAddress: string, fileId: string): AxiosPromise<FilePurchaseStatusResponse> {
        return axiosInstance.get(`/${TRANSACTIONS}/${dataMartAddress}/${PURCHASE_STATUS}/${fileId}`);
    }
}
