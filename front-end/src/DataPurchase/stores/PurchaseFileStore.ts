import {action, computed, observable} from "mobx";
import {AxiosError} from "axios";
import {ApiError, createErrorFromResponse, DataPurchaseService} from "../../api";
import {FileInfoResponse, FilePurchaseStatusResponse, PurchaseFileResponse} from "../../models";
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

    @observable
    filePurchaseStatus?: FilePurchaseStatusResponse = undefined;

    @observable
    showFilePurchaseDetailsDialog: boolean = false;

    @computed
    get dataMartAddress(): string | undefined {
        return this.settingsStore.selectedDataMartAccount;
    }

    constructor(settingsStore: SettingsStore) {
        this.settingsStore = settingsStore;
    }

    @action
    purchaseFile = async (file: FileInfoResponse): Promise<void> => {
        if (this.dataMartAddress) {
            this.pending = true;
            this.error = undefined;
            this.response = undefined;

            this.filePurchaseStatus = (await DataPurchaseService.checkFilePurchaseStatus(this.dataMartAddress, file.id)).data;

            if (this.filePurchaseStatus.purchased) {
                this.showFilePurchaseDetailsDialog = true;
                this.pending = false;
                return;
            }

            DataPurchaseService.purchaseFile(file.id, {dataMartAddress: this.dataMartAddress})
                .then(async ({data}) => {
                    this.response = data;
                    const fileData = (await DataPurchaseService.downloadFile(file.id)).data;
                    downloadFile(fileData, `${file.id}.${file.extension}`);

                    DataPurchaseService.checkFilePurchaseStatus(this.dataMartAddress!, file.id).then(({data}) => {
                        this.filePurchaseStatus = data;
                        this.showFilePurchaseDetailsDialog = true;
                    })
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
    };

    @action
    setShowFilePurchaseDetailsDialog = (showFilePurchaseDetailsDialog: boolean): void => {
        this.showFilePurchaseDetailsDialog = showFilePurchaseDetailsDialog;
    }
}
