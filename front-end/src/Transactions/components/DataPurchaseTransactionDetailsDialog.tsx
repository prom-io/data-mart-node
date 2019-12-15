import React, {FunctionComponent, Fragment} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle, Button, Typography, Table, TableCell, TableBody, TableRow, TableHead} from "@material-ui/core";
import {TransactionResponse, FileMetadata} from "../../models";
import {getMetadataKeyLabel} from "../../utils";
import {DataPurchaseService} from "../../api/services";
import {response} from "express";

const downloadFile = require("js-file-download");

interface DataPurchaseTransactionDetailsDialog {
    transaction?: TransactionResponse,
    onClose: () => void
}

export const DataPurchaseTransactionDetailsDialog: FunctionComponent<DataPurchaseTransactionDetailsDialog> = ({
    transaction,
    onClose
}) => {
    const regainFile = (fileId: string, extension: string) => {
        DataPurchaseService.regainFile(fileId).then(response => downloadFile(response.data, `${fileId}.${extension}`));
    };

    if (transaction) {
        return (
            <Dialog open={Boolean(transaction)}
                    onClose={onClose}
                    fullWidth
                    maxWidth="lg"
            >
                <DialogTitle>
                    Data Purchase Info
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        <b>Data owner:</b> {transaction?.dataOwner}
                    </Typography>
                    <Typography variant="body1">
                        <b>Sum:</b> {transaction?.value} PROM
                    </Typography>
                    <Typography variant="body1">
                        <b>Purchase date:</b> {transaction?.created_at}
                    </Typography>
                    <Typography variant="body1">
                        <b>Trx ID:</b> {transaction?.hash}
                    </Typography>
                    <Typography variant="body1">
                        <b>Data validator:</b> {transaction?.dataValidator}
                    </Typography>
                    {transaction?.file.metadata && (
                        <Fragment>
                            <Typography variant="body1">
                                File metadata
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Metadata key</TableCell>
                                        <TableCell>Metadata value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(transaction.file.metadata).map(key => (
                                        <TableRow>
                                            <TableCell>{getMetadataKeyLabel(key)}</TableCell>
                                            <TableCell>{typeof transaction?.file.metadata[key as keyof FileMetadata] === "string"
                                                ? transaction?.file.metadata[key as keyof FileMetadata] as string
                                                : (transaction?.file.metadata[key as keyof FileMetadata] as string[]).map(tag => `${tag}; `)
                                            }</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Fragment>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined"
                            color="secondary"
                            onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button variant="contained"
                            color="primary"
                            onClick={() => regainFile(transaction?.file.id, transaction?.file.extension)}
                    >
                        Regain file
                    </Button>
                </DialogActions>
            </Dialog>
        )
    } else {
        return null;
    }
};
