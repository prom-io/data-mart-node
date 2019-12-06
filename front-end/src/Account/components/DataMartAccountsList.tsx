import React, {FunctionComponent} from "react";
import {Grid, Typography} from "@material-ui/core";
import {AccountCard} from "./AccountCard";
import {AccountBalanceMapping, AccountResponse, AccountType} from "../../models";

interface DataMartAccountsListProps {
    accounts: AccountResponse[],
    balances: AccountBalanceMapping,
    defaultAccount?: string,
    onDefaultAccountSelected: (address: string) => void
}

export const DataMartAccountsList: FunctionComponent<DataMartAccountsListProps> = ({
    accounts,
    balances,
    defaultAccount,
    onDefaultAccountSelected
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="subtitle1">
                Data mart accounts
            </Typography>
        </Grid>
        {accounts.map(account => (
            <Grid item xs={12}>
                <AccountCard selectedAsDefault={account.address === defaultAccount}
                             onSelect={onDefaultAccountSelected}
                             address={account.address}
                             balance={balances[account.address]}
                             type={AccountType.DATA_MART}
                />
            </Grid>
        ))}
    </Grid>
);
