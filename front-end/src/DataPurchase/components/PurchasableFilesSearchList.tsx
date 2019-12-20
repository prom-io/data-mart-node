import React, {FunctionComponent, Fragment, useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import {Grid, Button, Hidden} from "@material-ui/core";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {FilesList} from "./FilesList";
import {SearchHashTags} from "./SearchHashTags";
import {FilesSearchQueryTextField} from "./FilesSearchQueryTextField";
import {FileDetailsDialog} from "./FileDetailsDialog";
import {DataPurchaseTransactionDetailsDialog} from "../../Transaction";
import {FileInfoResponse, PurchaseFileResponse, TransactionResponse} from "../../models";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface PurchasableFilesSearchListMobxProps {
    files: FileInfoResponse[],
    pending: boolean,
    error?: ApiError,
    purchaseFile: (file: FileInfoResponse) => void,
    purchasePending?: boolean,
    filePurchaseError?: ApiError,
    showSnackbar: boolean,
    filePurchaseResponse?: PurchaseFileResponse,
    setShowSnackbar: (showSnackbar: boolean) => void,
    addHashTag: (hashTag: string) => void,
    search: () => void,
    dataMartAccount: string | undefined,
    purchaseTransaction?: TransactionResponse,
    transactionDialogOpen: boolean,
    setTransactionDialogOpen: (open: boolean) => void
}

type PurchasableFilesSearchListProps = PurchasableFilesSearchListMobxProps & WithSnackbarProps;

const _PurchasableFilesSearchList: FunctionComponent<PurchasableFilesSearchListProps> = ({
    files,
    error,
    pending,
    filePurchaseError,
    filePurchaseResponse,
    purchasePending,
    showSnackbar,
    purchaseFile,
    setShowSnackbar,
    addHashTag,
    enqueueSnackbar,
    search,
    dataMartAccount,
    purchaseTransaction,
    setTransactionDialogOpen,
    transactionDialogOpen
}) => {
    const [purchasedFileId, setPurchasedFileId] = useState<string | undefined>(undefined);
    const [fileDisplayedInDialog, setFileDisplayedInDialog] = useState<FileInfoResponse | undefined>(undefined);

    useEffect(
        () => {
            if (purchaseTransaction) {
                setFileDisplayedInDialog(undefined);
            }
        }, [purchaseTransaction]
    );

    const handlePurchase = (file: FileInfoResponse) => {
        setPurchasedFileId(file.id);
        purchaseFile(file);
    };

    if (showSnackbar) {
        if (filePurchaseResponse) {
            enqueueSnackbar("File has been purchased")
        } else {
            enqueueSnackbar("Error occurred when tried to purchase file", {variant: "error"})
        }

        setShowSnackbar(false);
    }
    
    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3} style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column"
                }}>
                    <SearchHashTags/>
                </Grid>
                <Hidden smDown>
                    <Grid item md={3}/>
                </Hidden>
                <Grid item xs={12} md={6}>
                    <FilesSearchQueryTextField/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FilesList files={files}
                                       pending={pending}
                                       onHashTagClick={addHashTag}
                                       displayPurchaseButtons={Boolean(dataMartAccount)}
                                       filePurchaseError={filePurchaseError}
                                       filesFetchingError={error}
                                       onFilePurchase={handlePurchase}
                                       purchasedFileId={purchasedFileId}
                                       purchasePending={purchasePending}
                                       onShowDetailsRequest={setFileDisplayedInDialog}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined"
                                    color="primary"
                                    onClick={search}
                            >
                                Load more
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FileDetailsDialog fileInfo={purchaseTransaction ? undefined : fileDisplayedInDialog}
                               onClose={() => setFileDisplayedInDialog(undefined)}
                               displayPurchaseButton={Boolean(dataMartAccount)}
                               onPurchase={handlePurchase}
                               purchasePending={purchasePending}
            />
            <DataPurchaseTransactionDetailsDialog transaction={purchaseTransaction}
                                                  onClose={() => setTransactionDialogOpen(false)}
                                                  open={transactionDialogOpen}
            />
        </Fragment>
    )
};

const mapMobxToProps = (state: IAppState): PurchasableFilesSearchListMobxProps => ({
    search: state.filesSearch.searchFiles,
    purchasePending: state.filePurchase.pending,
    filePurchaseResponse: state.filePurchase.response,
    purchaseFile: state.filePurchase.purchaseFile,
    error: state.filesSearch.error,
    filePurchaseError: state.filePurchase.error,
    addHashTag: state.filesSearch.addTag,
    pending: state.filesSearch.pending,
    files: state.filesSearch.files,
    setShowSnackbar: state.filePurchase.setShowSnackbar,
    showSnackbar: state.filePurchase.showSnackbar,
    dataMartAccount: state.settings.selectedDataMartAccount,
    purchaseTransaction: state.filePurchase.filePurchaseStatus && state.filePurchase.filePurchaseStatus.transaction,
    transactionDialogOpen: state.filePurchase.showFilePurchaseDetailsDialog,
    setTransactionDialogOpen: state.filePurchase.setShowFilePurchaseDetailsDialog
});

export const PurchasableFilesSearchList = withSnackbar(
    inject(mapMobxToProps)(observer(_PurchasableFilesSearchList) as FunctionComponent<{}>)
);
