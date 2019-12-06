import {observable, action} from "mobx";
import {AxiosError} from "axios";
import {createErrorFromResponse, ApiError, DataPurchaseService} from "../../api";
import {FileInfoResponse} from "../../models";

export class FilesListStore {
    @observable
    files: FileInfoResponse[] = [];

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @action
    fetchFiles = (): void => {
        this.pending = true;
        this.error = undefined;

        DataPurchaseService.findAllFiles()
            .then(({data}) => this.files = data)
            .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
            .finally(() => this.pending = false);
    }
}
