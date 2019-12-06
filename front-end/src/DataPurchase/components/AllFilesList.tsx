import React, {FunctionComponent, useState} from "react";
import {inject, observer} from "mobx-react";
import {Grid, Typography} from "@material-ui/core";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {FilesList} from "./FilesList";
import {FileInfoResponse, PurchaseFileResponse} from "../../models";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface AllFilesListMobxProps {
    files: FileInfoResponse[],
    pending: boolean,
    filesFetchingError?: ApiError,
    purchaseFile: (file: FileInfoResponse) => void,
    purchasePending?: boolean,
    filePurchaseError?: ApiError,
    showSnackbar: boolean,
    filePurchaseResponse?: PurchaseFileResponse,
    setShowSnackbar: (showSnackbar: boolean) => void
}

type AllFilesListProps = AllFilesListMobxProps & WithSnackbarProps;

const _AllFilesList: FunctionComponent<AllFilesListProps> = ({
    files,
    pending,
    filesFetchingError,
    purchaseFile,
    filePurchaseError,
    enqueueSnackbar,
    purchasePending,
    showSnackbar,
    filePurchaseResponse,
    setShowSnackbar
}) => {
    const [purchasedFileId, setPurchasedFileId] = useState<string | undefined>(undefined);

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
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="body1">Files</Typography>
            </Grid>
            <Grid item xs={12}>
                <FilesList files={files}
                           pending={pending}
                           purchasePending={purchasePending}
                           displayPurchaseButtons
                           filePurchaseError={filePurchaseError}
                           filesFetchingError={filesFetchingError}
                           onFilePurchase={handlePurchase}
                           purchasedFileId={purchasedFileId}
                />
            </Grid>
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): AllFilesListMobxProps => ({
    filePurchaseError: state.filePurchase.error,
    files: state.files.files,
    filesFetchingError: state.files.error,
    pending: state.files.pending,
    showSnackbar: state.filePurchase.showSnackbar,
    purchaseFile: state.filePurchase.purchaseFile,
    setShowSnackbar: state.filePurchase.setShowSnackbar,
    filePurchaseResponse: state.filePurchase.response,
    purchasePending: state.filePurchase.pending
});

export const AllFilesList = withSnackbar(
    inject(mapMobxToProps)(observer(_AllFilesList)) as FunctionComponent<any>
);



