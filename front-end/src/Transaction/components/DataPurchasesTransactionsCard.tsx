import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Card, CardContent, CardHeader, Grid, Typography, createStyles, makeStyles} from "@material-ui/core";
import {TransactionsTable} from "./DataPurchasesTransactionsTable";
import {DataMartAccountSelect} from "../../Account";
import {ApiError} from "../../api";
import {IAppState} from "../../store";
import {TransactionResponse} from "../../models";

interface DataPurchasesTransactionsCardMobxProps {
    selectedAccount?: string,
    accounts: string[],
    pending: boolean,
    error?: ApiError,
    transactions: TransactionResponse[],
    setDefaultAccount: (address: string) => void,
    fetchTransactions: () => void
}

interface DataPurchasesTransactionsCardOwnProps {
    titlePrefix?: "Data Purchases" | "Transactions",
    hideAccountSelect?: boolean
}

type DataPurchasesTransactionsCardProps = DataPurchasesTransactionsCardMobxProps & DataPurchasesTransactionsCardOwnProps;

const useStyles = makeStyles(() => createStyles({
    transactionsCard: {
        overflowX: "auto"
    }
}));

const _DataPurchasesTransactionsCard: FunctionComponent<DataPurchasesTransactionsCardProps> = ({
    accounts,
    selectedAccount,
    pending,
    error,
    setDefaultAccount,
    transactions,
    fetchTransactions,
    titlePrefix = "Data Purchases",
    hideAccountSelect = false
}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {!hideAccountSelect && (
                    <DataMartAccountSelect accounts={accounts}
                                           onSelect={setDefaultAccount}
                                           selectedAccount={selectedAccount}
                    />
                )}
            </Grid>
            <Grid item xs={12}>
                {transactions.length === 0 && error && (
                    <Typography variant="body1">
                        Error occurred when tried to fetch transactions
                    </Typography>
                )}
                <Card className={classes.transactionsCard}>
                    <CardHeader title={`${titlePrefix} of ${selectedAccount}`}/>
                    <CardContent>
                        <TransactionsTable transactions={transactions}
                                           pending={pending}
                                           onFetchMoreRequest={fetchTransactions}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): DataPurchasesTransactionsCardMobxProps => ({
    accounts: state.transactions.accounts,
    transactions: state.transactions.transactions,
    pending: state.transactions.pending,
    selectedAccount: state.transactions.selectedAccount,
    error: state.transactions.error,
    fetchTransactions: state.transactions.fetchTransactions,
    setDefaultAccount: state.settings.selectDataMartAccount
});

export const DataPurchasesTransactionsCard = inject(mapMobxToProps)(observer(_DataPurchasesTransactionsCard as FunctionComponent<DataPurchasesTransactionsCardOwnProps>));

