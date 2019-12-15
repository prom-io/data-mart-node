import React, {FunctionComponent} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle, Button} from "@material-ui/core";
import {TransactionResponse} from "../../models";

interface DataPurchaseTransactionDetailsDialog {
    transaction: TransactionResponse,
    onClose: () => void
}

