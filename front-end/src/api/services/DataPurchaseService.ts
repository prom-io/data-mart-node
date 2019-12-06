import {AxiosPromise} from "axios";
import {axiosInstance} from "../api-client";
import {FileInfoResponse, PurchaseFileRequest, PurchaseFileResponse} from "../../models";
import {FILES_V2, INFO, PURCHASE} from "../endpoints";

export class DataPurchaseService {
    public static findAllFiles(): AxiosPromise<FileInfoResponse[]> {
        return axiosInstance.get(`/${FILES_V2}`);
    }

    public static findFilesOfDataValidator(dataValidatorAddress: string): AxiosPromise<FileInfoResponse[]> {
        return axiosInstance.get(`/${FILES_V2}?dataValidator=${dataValidatorAddress}`);
    }

    public static getFileInfoById(fileId: string): AxiosPromise<FileInfoResponse> {
        return axiosInstance.get(`/${FILES_V2}/${fileId}/${INFO}`);
    }

    public static downloadFile(fileId: string): AxiosPromise<void> {
        return axiosInstance.get(`/${FILES_V2}/${fileId}`, {responseType: 'blob'});
    }

    public static purchaseFile(fileId: string, purchaseFileRequest: PurchaseFileRequest): AxiosPromise<PurchaseFileResponse> {
        return axiosInstance.post(`/${FILES_V2}/${fileId}/${PURCHASE}`, purchaseFileRequest);
    }
}
