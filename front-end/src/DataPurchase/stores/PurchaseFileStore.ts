import {action, computed, observable} from "mobx";
import {AxiosError} from "axios";
import {ApiError, createErrorFromResponse, DataPurchaseService} from "../../api";
import {FileInfoResponse, PurchaseFileResponse} from "../../models";
import {SettingsStore} from "../../Settings";

const downloadFile = require("js-file-download");

export class PurchaseFileStore {
    private readonly settingsStore: SettingsStore;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    showSnackbar: boolean = false;

    @observable
    response?: PurchaseFileResponse = undefined;

    @computed
    get dataMartAddress(): string | undefined {
        return this.settingsStore.selectedDataMartAccount;
    }

    constructor(settingsStore: SettingsStore) {
        this.settingsStore = settingsStore;
    }

    @action
    purchaseFile = (file: FileInfoResponse): void => {
        if (this.dataMartAddress) {
            this.pending = true;
            this.error = undefined;
            this.response = undefined;

            DataPurchaseService.purchaseFile(file.id, {dataMartAddress: this.dataMartAddress})
                .then(async ({data}) => {
                    this.response = data;
                    const fileData = (await DataPurchaseService.downloadFile(file.id)).data;
                    downloadFile(fileData, `${file.name}.${file.extension}`);
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => {
                    this.pending = false;
                    this.showSnackbar = true;
                });
        }
    };

    @action
    setShowSnackbar = (showSnackBar: boolean): void => {
        this.showSnackbar = showSnackBar;
    }
}
