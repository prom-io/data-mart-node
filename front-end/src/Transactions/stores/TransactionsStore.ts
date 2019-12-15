import {observable, action, reaction, computed} from "mobx";
import uniqBy from "lodash.uniqby";
import {ApiError, createErrorFromResponse, TransactionsService} from "../../api";
import {TransactionResponse} from "../../models";
import {AccountsStore} from "../../Account";
import {SettingsStore} from "../../Settings/stores";
import {AxiosError} from "axios";

const PAGE_SIZE = 50;

export class TransactionsStore {
    private readonly settingsStore: SettingsStore;
    private readonly accountsStore: AccountsStore;

    @observable
    transactions: TransactionResponse[] = [];

    @observable
    selectedAccount: string | undefined = undefined;

    @observable
    page: number = 0;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @computed
    get defaultDataMartAccount(): string | undefined {
        return this.settingsStore.selectedDataMartAccount;
    }

    @computed
    get accounts(): string[] {
        return this.accountsStore.accounts.map(account => account.address);
    }

    constructor(settingsStore: SettingsStore, accountsStore: AccountsStore) {
        this.settingsStore = settingsStore;
        this.accountsStore = accountsStore;
        this.selectedAccount = this.defaultDataMartAccount;

        reaction(
            () => this.selectedAccount,
            () => {
                this.page = 1;
                this.fetchTransactions();
            }
        )
    }

    @action
    fetchTransactions = (): void => {
        if (this.selectedAccount) {
            this.pending = true;
            this.error = undefined;

            TransactionsService.getTransactionsByAddress(this.selectedAccount, this.page, PAGE_SIZE)
                .then(({data}) => {
                    if (data.length !==0) {
                        this.transactions.push(...data);
                        this.transactions = uniqBy(this.transactions, "hash");

                        if (data.length === PAGE_SIZE) {
                            this.page = this.page + 1;
                        }
                    }
                })
                .catch((error: AxiosError) => this.error = createErrorFromResponse(error))
                .finally(() => this.pending = false);
        }
    };

    @action
    setSelectedAccount = (account: string): void => {
        this.selectedAccount = account;
    }
}
