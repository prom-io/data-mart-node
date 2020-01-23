import React, {FunctionComponent, Fragment, useState} from "react";
import {Table, TableHead, TableRow, TableCell, TableBody, Grid, Button, CircularProgress, Typography, createStyles, makeStyles} from "@material-ui/core";
import {DataPurchaseTransactionDetailsDialog} from "./DataPurchaseTransactionDetailsDialog";
import {TransactionResponse} from "../../models";
import {shortenString, makePreciseNumberString} from "../../utils";

interface TransactionsTableProps {
    transactions: TransactionResponse[],
    pending: boolean,
    onFetchMoreRequest: () => void
}

const useStyles = makeStyles(() => createStyles({
    centered: {
        
    }
}))

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
                                <TableCell><b>Data Owner (Wallet ID)</b></TableCell>
                                <TableCell><b>Sum</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Data Validator</b></TableCell>
                                <TableCell><b>Txn Hash</b></TableCell>
                                <TableCell><b>File ID</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(transaction => (
                                <TableRow>
                                    <TableCell>
                                        {shortenString(transaction.dataOwner, 16)}
                                    </TableCell>
                                    <TableCell>
                                        {makePreciseNumberString(transaction.value)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.created_at}
                                    </TableCell>
                                    <TableCell>
                                        {shortenString(transaction.dataValidator, 16)}
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
