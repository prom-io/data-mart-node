import React, {Fragment, FunctionComponent} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {FileMetadata, TransactionResponse} from "../../models";
import {getMetadataKeyLabel} from "../../utils";
import {DataPurchaseService} from "../../api/services";

const downloadFile = require("js-file-download");

interface DataPurchaseTransactionDetailsDialog {
    transaction?: TransactionResponse,
    open?: boolean,
    onClose: () => void
}

export const DataPurchaseTransactionDetailsDialog: FunctionComponent<DataPurchaseTransactionDetailsDialog> = ({
    transaction,
    onClose,
    open
}) => {
    const regainFile = (fileId: string, extension: string) => {
        DataPurchaseService.regainFile(fileId).then(response => downloadFile(response.data, `${fileId}.${extension}`));
    };

    const dialogOpen = open === undefined
        ? Boolean(transaction)
        : Boolean(transaction) && open;

    if (transaction) {
        return (
            <Dialog open={dialogOpen}
                    onClose={onClose}
                    fullWidth
                    maxWidth="md"
            >
                <DialogTitle>
                    Data Purchase Info
                </DialogTitle>
                <DialogContent>
                   <Table>
                       <TableRow>
                           <TableCell>Data owner</TableCell>
                           <TableCell>{transaction?.dataOwner}</TableCell>
                       </TableRow>
                       <TableRow>
                           <TableCell>Sum</TableCell>
                           <TableCell>{transaction?.value}</TableCell>
                       </TableRow>
                       <TableRow>
                           <TableCell>Purchase date</TableCell>
                           <TableCell>{transaction?.created_at}</TableCell>
                       </TableRow>
                       <TableRow>
                           <TableCell>Txn Hash</TableCell>
                           <TableCell>{transaction?.hash}</TableCell>
                       </TableRow>
                       <TableRow>
                           <TableCell>Data validator</TableCell>
                           <TableCell>{transaction?.dataValidator}</TableCell>
                       </TableRow>
                       {transaction?.file && (
                           <TableRow>
                               <TableCell>File ID</TableCell>
                               <TableCell>{transaction?.file.id}</TableCell>
                           </TableRow>
                       )}
                   </Table>
                    <br/>
                    {transaction?.file && transaction?.file.metadata && (
                        <Fragment>
                            <Typography variant="body1">
                                File metadata
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Metadata key</b></TableCell>
                                        <TableCell><b>Metadata value</b></TableCell>
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
