import {observable, action} from "mobx";
import {createErrorFromResponse, ApiError, DataPurchaseService} from "../../api";
import {FileInfoResponse} from "../../models";
import {AxiosError} from "axios";

export class FilesOfDataValidatorStore {
    @observable
    files: FileInfoResponse[] = [];

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    dataValidatorAddress?: string = undefined;

    @action
    fetchFilesOfDataValidator = (dataValidatorAddress: string): void => {
        this.dataValidatorAddress = dataValidatorAddress;
        this.pending = true;
        this.error = undefined;

        DataPurchaseService.findFilesOfDataValidator(dataValidatorAddress)
            .then(({data}) => this.files = data)
            .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
            .finally(() => this.pending = false);
    }
}
