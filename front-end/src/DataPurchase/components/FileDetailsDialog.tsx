import React, {FunctionComponent} from "react";
import {Dialog, DialogContent, DialogActions, DialogTitle, Typography, Button, CircularProgress} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import prettyBytes from "pretty-bytes";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";
import {FileHashTags} from "./FileHashTags";

interface FileDetailsDialogOwnProps {
    fileInfo?: FileInfoResponse,
    onPurchase?: (fileInfo: FileInfoResponse) => void,
    purchasePending?: boolean,
    purchaseError?: ApiError,
    displayPurchaseButton?: boolean,
    onClose: () => void,
}

type FileDetailsDialogProps = FileDetailsDialogOwnProps & WithMobileDialog;

const _FileDetailsDialog: FunctionComponent<FileDetailsDialogProps> = ({
    fileInfo,
    purchasePending,
    fullScreen,
    displayPurchaseButton,
    onPurchase,
    purchaseError,
    onClose
}) => {
    const handlePurchase = () => {
        if (onPurchase && fileInfo) {
            onPurchase(fileInfo);
        }
    };

    if (fileInfo) {
        return (
            <Dialog open={Boolean(fileInfo)}
                    fullScreen={fullScreen}
                    onClose={onClose}
            >
                <DialogTitle>
                    {fileInfo?.metadata && fileInfo.metadata.briefDescription ? fileInfo.metadata.briefDescription : `${fileInfo?.name}.${fileInfo?.extension}`}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        <b>Price:</b>{fileInfo?.price} PROM
                    </Typography>
                    {fileInfo?.metadata && fileInfo.metadata.author && (
                        <Typography variant="body1">
                            <b>Author:</b> {fileInfo?.metadata.author}
                        </Typography>
                    )}
                    {fileInfo?.metadata && fileInfo.metadata.hashTags && (
                        <FileHashTags hashTags={fileInfo?.metadata.hashTags} onHashTagClick={() => {}}/>
                    )}
                    <Typography variant="body1">
                        <b>Mime type:</b> {fileInfo?.mimeType}
                    </Typography>
                    <Typography variant="body1">
                        <b>Size:</b> {prettyBytes(fileInfo?.size)}
                    </Typography>
                    {fileInfo?.metadata && fileInfo.metadata.fullDescription && (
                        <Typography variant="body1">
                            {fileInfo?.metadata.fullDescription}
                        </Typography>
                    )}
                    {fileInfo?.metadata && fileInfo.metadata.userComment && (
                        <Typography variant="body1">
                            <i>{fileInfo?.metadata.userComment}</i>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    {purchasePending && <CircularProgress color="primary" size={15}/>}
                    {displayPurchaseButton && (
                        <Button variant="contained"
                                color="primary"
                                disabled={purchasePending}
                                onClick={handlePurchase}
                        >
                            Purchase
                        </Button>
                    )}
                    <Button variant="outlined"
                            color="secondary"
                            onClick={onClose}
                    >
                        Close
                    </Button>
                    {purchaseError && (
                        <Typography variant="body1"
                                    style={{color: 'red'}}
                        >
                            Error occurred when tried to purchase file
                        </Typography>
                    )}
                </DialogActions>
            </Dialog>
        )
    } else {
        return null;
    }
};

export const FileDetailsDialog = withMobileDialog()(_FileDetailsDialog) as FunctionComponent<FileDetailsDialogOwnProps>;
