import {action, computed, observable, reaction} from "mobx";
import {AccountResponse} from "../../models";
import {ApiError} from "../../api";
import {AccountsStore} from "../../Account";

export class SettingsStore {
    private readonly accountsStore: AccountsStore;

    @observable
    selectedDataMartAccount?: string = localStorage.getItem("selectedDataMartAccount") !== null
        ? localStorage.getItem("selectedDataMartAccount")!
        : undefined;

    @computed
    get dataMartAccounts(): AccountResponse[] {
        return this.accountsStore.accounts;
    }

    @computed
    get fetchingAccounts(): boolean {
        return this.accountsStore.fetchingAccounts;
    }

    @computed
    get fetchingAccountsError(): ApiError | undefined {
        return this.accountsStore.accountsFetchingError;
    }

    constructor(accountsStore: AccountsStore) {
        this.accountsStore = accountsStore;

        reaction(
            () => this.accountsStore.accounts,
            accounts => {
                if (accounts && accounts.length !== 0 && !this.selectedDataMartAccount) {
                    this.selectDataMartAccount(accounts[0].address);
                }
            }
        )
    }

    @action
    selectDataMartAccount = (accountAddress: string): void => {
        localStorage.setItem("selectedDataMartAccount", accountAddress);
        this.selectedDataMartAccount = accountAddress;
    }
}
