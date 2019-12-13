import React, {FunctionComponent, useState} from "react";
import {inject, observer} from "mobx-react";
import {Grid, Button, Hidden} from "@material-ui/core";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {FilesList} from "./FilesList";
import {SearchHashTags} from "./SearchHashTags";
import {FilesSearchQueryTextField} from "./FilesSearchQueryTextField";
import {FileInfoResponse, PurchaseFileResponse} from "../../models";
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
    search: () => void
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
    search
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
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <SearchHashTags/>
            </Grid>
            <Hidden smUp>
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
                                   displayPurchaseButtons
                                   filePurchaseError={filePurchaseError}
                                   filesFetchingError={error}
                                   onFilePurchase={handlePurchase}
                                   purchasedFileId={purchasedFileId}
                                   purchasePending={purchasePending}
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
    showSnackbar: state.filePurchase.showSnackbar
});

export const PurchasableFilesSearchList = withSnackbar(
    inject(mapMobxToProps)(observer(_PurchasableFilesSearchList) as FunctionComponent<{}>)
);
