import React, {FunctionComponent, Fragment, useState} from "react";
import {Table, TableHead, TableRow, TableCell, TableBody, Grid, Button, CircularProgress, Typography} from "@material-ui/core";
import {TransactionResponse} from "../../models";
import {shortenString} from "../../utils";
import {DataPurchaseTransactionDetailsDialog} from "./DataPurchaseTransactionDetailsDialog";

interface TransactionsTableProps {
    transactions: TransactionResponse[],
    pending: boolean,
    onFetchMoreRequest: () => void
}

export const TransactionsTable: FunctionComponent<TransactionsTableProps> = ({
    transactions,
    pending,
    onFetchMoreRequest
}) => {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | undefined>(undefined);

    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data Owner (Wallet ID)</TableCell>
                                <TableCell>Sum</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Data Validator</TableCell>
                                <TableCell>Txn Hash</TableCell>
                                <TableCell>File ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(transaction => (
                                <TableRow>
                                    <TableCell>
                                        {transaction.dataOwner}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.value}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.created_at}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.dataValidator}
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{cursor: 'pointer'}}
                                                    onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            <u>{shortenString(transaction.hash, 16)}</u>
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{transaction.file.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined"
                            color="primary"
                            onClick={onFetchMoreRequest}
                    >
                        Load more
                    </Button>
                    {pending && <CircularProgress size={15} color="primary"/>}
                </Grid>
            </Grid>
            <DataPurchaseTransactionDetailsDialog onClose={() => setSelectedTransaction(undefined)}
                                                  transaction={selectedTransaction}
            />
        </Fragment>
    )
};
