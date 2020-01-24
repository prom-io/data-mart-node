import {action, computed, observable, reaction, toJS} from "mobx";
import {AxiosError} from "axios";
import uniqBy from "lodash.uniqby";
import {ApiError, createErrorFromResponse, TransactionsService} from "../../api";
import {TransactionResponse, TransactionType} from "../../models";
import {AccountsStore} from "../../Account";
import {SettingsStore} from "../../Settings";

const PAGE_SIZE = 50;

export class TransactionsStore {
    private readonly settingsStore: SettingsStore;
    private readonly accountsStore: AccountsStore;

    @observable
    transactions: TransactionResponse[] = [];

    @observable
    page: number = 0;

    @observable
    pending: boolean = false;

    @observable
    error?: ApiError = undefined;

    @observable
    refreshOnDefaultAccountChange: boolean = false;

    @computed
    get accounts(): string[] {
        return this.accountsStore.accounts.map(account => account.address);
    }

    @computed
    get selectedAccount(): string | undefined {
        return this.settingsStore.selectedDataMartAccount;
    }

    constructor(settingsStore: SettingsStore, accountsStore: AccountsStore) {
        this.settingsStore = settingsStore;
        this.accountsStore = accountsStore;

        reaction(
            () => this.selectedAccount,
            () => {
                if (this.refreshOnDefaultAccountChange) {
                    this.transactions = [];
                    this.page = 0;
                    this.fetchTransactions();
                }
            }
        )
    }

    @action
    setRefreshOnDefaultAccountChange = (refreshOnDefaultAccountChange: boolean): void =>  {
        this.refreshOnDefaultAccountChange = refreshOnDefaultAccountChange;
    };

    @action
    fetchTransactions = (): void => {
        if (this.selectedAccount) {
            this.pending = true;
            this.error = undefined;

            TransactionsService.getTransactionsByAddress(this.selectedAccount, this.page, PAGE_SIZE)
                .then(({data}) => {
                    if (data.length !==0) {
                        data = data.filter(transaction => transaction.type === TransactionType.DATA_PURCHASE);
                        this.transactions.push(...data);
                        console.log(toJS(this.transactions));
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
}
