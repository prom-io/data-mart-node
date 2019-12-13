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
import {AccountType} from "../models";

const accounts = new AccountsStore();
const balances = new AccountsBalanceStore(accounts);
const settings = new SettingsStore(accounts);
const registration = new AccountRegistrationStore(accounts, AccountType.DATA_VALIDATOR);
const dataValidatorRegistration = new AccountRegistrationStore(accounts, AccountType.DATA_VALIDATOR);
const dataMartRegistration = new AccountRegistrationStore(accounts, AccountType.DATA_MART);
const serviceNodeRegistration = new AccountRegistrationStore(accounts, AccountType.SERVICE_NODE);
const files = new FilesListStore();
const filesOfDataValidator = new FilesOfDataValidatorStore();
const filePurchase = new PurchaseFileStore(settings);
const fileInfo = new FileInfoStore();
const filesSearch = new FilesSearchStore();

export const store: IAppState = {
    settings,
    registration,
    drawer: new DrawerStore(),
    accounts,
    balances,
    dataMartRegistration,
    dataValidatorRegistration,
    serviceNodeRegistration,
    files,
    filesOfDataValidator,
    fileInfo,
    filePurchase,
    filesSearch
};
