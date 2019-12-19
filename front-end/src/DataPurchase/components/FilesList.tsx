import React, {FunctionComponent, ReactElement, Fragment} from "react";
import {CircularProgress, Grid, createStyles, makeStyles, Typography} from "@material-ui/core";
import {FileCard} from "./FileCard";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";

interface FilesListProps {
    files: FileInfoResponse[],
    pending: boolean,
    filesFetchingError?: ApiError,
    displayPurchaseButtons?: boolean,
    onFilePurchase?: (file: FileInfoResponse) => void,
    purchasedFileId?: string,
    filePurchaseError?: ApiError,
    purchasePending?: boolean,
    onHashTagClick: (hashTag: string) => void,
    onShowDetailsRequest: (file: FileInfoResponse) => void
}

const useStyles = makeStyles(() => createStyles({
    centered: {
        marginRight: 'auto',
        marginLeft: 'auto'
    }
}));

export const FilesList: FunctionComponent<FilesListProps> = ({
    files,
    pending,
    filesFetchingError,
    displayPurchaseButtons,
    onFilePurchase,
    purchasedFileId,
    filePurchaseError,
    purchasePending,
    onHashTagClick,
    onShowDetailsRequest
}) => {
    const classes = useStyles();
    let content: ReactElement;

    if (pending && files.length === 0) {
        content = <CircularProgress size={50} color="primary" className={classes.centered}/>;
    } else if (filesFetchingError) {
        content = <Typography variant="h4">Error occurred when tried to fetch files</Typography>;
    } else {
        content = (
            <Fragment>
                {files.map(file => (
                    <Grid item xs={12} md={6} lg={4}>
                        <FileCard fileInfo={file}
                                  onPurchase={onFilePurchase}
                                  displayPurchaseButton={displayPurchaseButtons}
                                  purchaseError={purchasedFileId === file.id ? filePurchaseError : undefined}
                                  purchasePending={purchasePending && purchasedFileId === file.id}
                                  onHashTagClick={onHashTagClick}
                                  onDetailsRequest={() => onShowDetailsRequest(file)}
                                  disablePurchaseButton={purchasePending === undefined ? false : purchasePending}
                        />
                    </Grid>
                ))}
                {pending && <CircularProgress size={50} color="primary" className={classes.centered}/>}
            </Fragment>
        );
    }

    return (
        <Grid container spacing={2}>
            {content}
        </Grid>
    )
};
