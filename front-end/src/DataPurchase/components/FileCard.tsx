import React, {FunctionComponent} from "react";
import {Card, CardHeader, CardActions, CardContent, Button, Typography, CircularProgress} from "@material-ui/core";
import prettyBytes from "pretty-bytes";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";

interface FileCardProps {
    fileInfo: FileInfoResponse,
    onPurchase?: (fileInfo: FileInfoResponse) => void,
    purchasePending?: boolean,
    purchaseError?: ApiError,
    displayPurchaseButton?: boolean
}

export const FileCard: FunctionComponent<FileCardProps> = ({
    fileInfo,
    onPurchase,
    purchasePending,
    purchaseError,
    displayPurchaseButton = false
}) => (
    <Card>
        <CardHeader title={(
            <Typography variant="h6" noWrap>
                {fileInfo.name}.{fileInfo.extension}
            </Typography>
        )}/>
        <CardContent>
            <Typography variant="body1">
                Price: {fileInfo.price} PROM
            </Typography>
            <Typography variant="body1">
                Size: {prettyBytes(fileInfo.size)}
            </Typography>
            <Typography variant="body1">
                Mime type: {fileInfo.mimeType}
            </Typography>
            <Typography variant="body1" noWrap>
                Data validator: {fileInfo.dataValidator}
            </Typography>
        </CardContent>
        {displayPurchaseButton && (
            <CardActions>
                <Button variant="contained"
                        color="primary"
                        disabled={purchasePending}
                        onClick={() => onPurchase && onPurchase(fileInfo)}
                >
                    Purchase
                </Button>
                {purchasePending && <CircularProgress size={15} color="primary"/>}
            </CardActions>
        )}
    </Card>
);
