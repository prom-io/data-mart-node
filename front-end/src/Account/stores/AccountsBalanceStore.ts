import {action, observable, reaction} from "mobx";
import {AccountsStore} from "./AccountsStore";
import {AccountBalanceMapping} from "../../models";
import {AccountsService} from "../../api";

export class AccountsBalanceStore {
    @observable
    accountsBalances: AccountBalanceMapping = {};

    private readonly accountsStore: AccountsStore;

    constructor(accountsStore: AccountsStore) {
        this.accountsStore = accountsStore;

        reaction(
            () => this.accountsStore.accounts,
            () => {
                this.setInitialBalances();
                this.fetchBalancesOfAllAccounts();
            }
        );

        setInterval(this.fetchBalancesOfAllAccounts, 10000);
    }

    @action
    setInitialBalances = (): void => {
        this.accountsStore.accounts.forEach(account => {
            if (this.accountsBalances[account.address] === undefined) {
                this.accountsBalances[account.address] = 0;
            }
        })
    };

    @action
    fetchBalancesOfAllAccounts = (): void => {
        AccountsService.getBalancesOfAllAccounts()
            .then(({data}) => this.accountsBalances = {...this.accountsBalances, ...data})
            .catch(ignored => {});
    };
}
