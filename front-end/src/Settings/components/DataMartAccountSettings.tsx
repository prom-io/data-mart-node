import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Grid} from "@material-ui/core";
import {DataMartAccountsList} from "../../Account";
import {AccountBalanceMapping, AccountResponse} from "../../models";
import {IAppState} from "../../store";

interface DataMartAccountSettingsMobxProps {
    accounts: AccountResponse[],
    balances: AccountBalanceMapping,
    selectedAccount?: string,
    selectAccount: (address: string) => void
}

const _DataMartAccountSettings: FunctionComponent<DataMartAccountSettingsMobxProps> = ({
    selectedAccount,
    accounts,
    balances,
    selectAccount
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <DataMartAccountsList accounts={accounts}
                                     balances={balances}
                                     defaultAccount={selectedAccount}
                                     onDefaultAccountSelected={selectAccount}
            />
        </Grid>
    </Grid>
);

const mapMobxToProps = (state: IAppState): DataMartAccountSettingsMobxProps => ({
    accounts: state.accounts.accounts,
    balances: state.balances.accountsBalances,
    selectedAccount: state.settings.selectedDataMartAccount,
    selectAccount: state.settings.selectDataMartAccount
});

export const DataMartAccountSettings = inject(mapMobxToProps)(observer(_DataMartAccountSettings)) as FunctionComponent<any>;
