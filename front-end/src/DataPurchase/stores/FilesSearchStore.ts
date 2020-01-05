import {AxiosError} from "axios";
import {observable, action, reaction} from "mobx";
import uniqBy from "lodash.uniqby";
import {createErrorFromResponse, ApiError, DataPurchaseService} from "../../api";
import {FileInfoResponse} from "../../models";

const PAGE_SIZE = 30;

export class FilesSearchStore {
    @observable
    query: string = "";

    @observable
    tags: string[] = [];

    @observable
    currentPage: number = 1;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    files: FileInfoResponse[] = [];

    @observable
    shouldResetResults: boolean = false;


    constructor() {
        reaction(
            () => this.query,
            () => this.shouldResetResults = true
        );

        reaction(
            () => this.tags,
            () => {
                this.shouldResetResults = true;
                this.searchFiles();
            }
        )
    }

    @action
    setQuery = (query: string): void => {
        this.query = query;
    };

    @action
    addTag = (tag: string): void => {
        this.tags = [
            ...this.tags,
            tag
        ]
    };

    @action
    removeTagByIndex = (tagIndex: number): void => {
        this.tags = this.tags.filter((_, index) => index !== tagIndex);
    };

    @action
    clearTags = (): void => {
        this.tags = [];
    };

    @action
    searchFiles = (): void => {
        if (this.shouldResetResults) {
            this.files = [];
            this.currentPage = 1;
            this.shouldResetResults = false;
        }

        this.error = undefined;
        this.pending = true;

        if (this.tags.length !== 0) {
            DataPurchaseService.searchFilesByQueryAndTags(
                this.query,
                this.tags,
                this.currentPage,
                PAGE_SIZE
            )
                .then(({data}) => {
                    if (data.length !== 0) {
                        this.files = [
                            ...this.files,
                            ...data
                        ];
                        this.files = uniqBy(this.files, "id");

                        if (data.length === PAGE_SIZE) {
                            this.currentPage += 1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.pending = false);
        } else {
            DataPurchaseService.searchFiles(this.query, this.currentPage, PAGE_SIZE)
                .then(({data}) => {
                    if (data.length !== 0) {
                        this.files.push(...data);
                        this.files = uniqBy(this.files, "id");

                        if (data.length === PAGE_SIZE) {
                            this.currentPage += 1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.pending = false);
        }
    }
}
