import Web3 from "web3";
import {IAppState} from "./IAppState";
import {
    AccountRegistrationStore,
    AccountsBalanceStore,
    AccountsStore,
} from "../Account";
import {DrawerStore} from "../AppBar";
import {SettingsStore} from "../Settings";
import {
    FileInfoStore,
    FilesListStore,
    FilesOfDataValidatorStore,
    FilesSearchStore,
    PurchaseFileStore
} from "../DataPurchase";
import {TransactionsStore} from "../Transaction";
import {AccountType} from "../models";

const accounts = new AccountsStore();
const balances = new AccountsBalanceStore(accounts);
const settings = new SettingsStore(accounts);
const registration = new AccountRegistrationStore(accounts, AccountType.DATA_MART, new Web3());
const files = new FilesListStore();
const filesOfDataValidator = new FilesOfDataValidatorStore();
const filePurchase = new PurchaseFileStore(settings);
const fileInfo = new FileInfoStore();
const filesSearch = new FilesSearchStore();
const transactions = new TransactionsStore(settings, accounts);

export const store: IAppState = {
    settings,
    registration,
    drawer: new DrawerStore(),
    accounts,
    balances,
    files,
    filesOfDataValidator,
    fileInfo,
    filePurchase,
    filesSearch,
    transactions
};
