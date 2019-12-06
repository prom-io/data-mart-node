import {action, observable} from "mobx";
import {AxiosError} from "axios";
import {FileInfoResponse} from "../../models";
import {ApiError, createErrorFromResponse, DataPurchaseService} from "../../api";

export class FileInfoStore {
    @observable
    fileId?: string = undefined;

    @observable
    fileInfo?: FileInfoResponse = undefined;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError;

    @action
    fetchFileInfo = (fileId: string): void => {
        this.fileId = fileId;
        this.pending = true;

        DataPurchaseService.getFileInfoById(fileId)
            .then(({data}) => this.fileInfo = data)
            .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
            .finally(() => this.pending = false);
    }
}
