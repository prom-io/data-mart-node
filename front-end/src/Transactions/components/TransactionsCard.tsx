import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Card, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";
import {TransactionsTable} from "./TransactionsTable";
import {DataMartAccountSelect} from "../../Account";
import {ApiError} from "../../api";
import {IAppState} from "../../store";
import {TransactionResponse} from "../../models";

interface TransactionsCardMobxProps {
    selectedAccount?: string,
    accounts: string[],
    pending: boolean,
    error?: ApiError,
    transactions: TransactionResponse[],
    selectAccount: (address: string) => void,
    fetchTransactions: () => void
}

const _TransactionsCard: FunctionComponent<TransactionsCardMobxProps> = ({
    accounts,
    selectedAccount,
    pending,
    error,
    selectAccount,
    transactions,
    fetchTransactions
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <DataMartAccountSelect accounts={accounts}
                                   onSelect={selectAccount}
                                   selectedAccount={selectedAccount}
            />
        </Grid>
        <Grid item xs={12}>
            {transactions.length === 0 && error && (
                <Typography variant="h1">
                    Error occurred when tried to fetch transactions
                </Typography>
            )}
            <Card>
                <CardHeader title="Data Purchases"/>
                <CardContent>
                    <TransactionsTable transactions={transactions}
                                       pending={pending}
                                       onFetchMoreRequest={fetchTransactions}
                    />
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

const mapMobxToProps = (state: IAppState): TransactionsCardMobxProps => ({
    accounts: state.transactions.accounts,
    transactions: state.transactions.transactions,
    pending: state.transactions.pending,
    selectedAccount: state.transactions.selectedAccount,
    error: state.transactions.error,
    selectAccount: state.transactions.setSelectedAccount,
    fetchTransactions: state.transactions.fetchTransactions
});

export const TransactionsCard = inject(mapMobxToProps)(observer(_TransactionsCard) as FunctionComponent<{}>);

