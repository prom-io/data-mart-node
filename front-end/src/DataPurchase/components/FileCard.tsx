import React, {FunctionComponent} from "react";
import {Card, CardHeader, CardActions, CardContent, Button, Typography, CircularProgress, IconButton, Tooltip} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";
import {FileHashTags} from "./FileHashTags";

interface FileCardProps {
    fileInfo: FileInfoResponse,
    onPurchase?: (fileInfo: FileInfoResponse) => void,
    purchasePending?: boolean,
    purchaseError?: ApiError,
    displayPurchaseButton?: boolean,
    onHashTagClick: (tag: string) => void,
    onDetailsRequest: () => void
}

export const FileCard: FunctionComponent<FileCardProps> = ({
    fileInfo,
    onPurchase,
    purchasePending,
    purchaseError,
    displayPurchaseButton = false,
    onHashTagClick,
    onDetailsRequest
}) => (
    <Card style={{height: '100%'}}>
        <CardHeader title={(
            <Typography variant="h6" noWrap>
                {fileInfo.metadata.briefDescription ? fileInfo.metadata.briefDescription : `${fileInfo.name}.${fileInfo.extension}`}
            </Typography>
        )}
                    action={(
                        <Tooltip title="Show details">
                            <IconButton onClick={onDetailsRequest}>
                                <ExpandMoreIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
        />
        <CardContent>
            <Typography variant="body1">
                <b>Price</b>: {fileInfo.price} PROM
            </Typography>
            {fileInfo.metadata.author && <Typography variant="body1"><b>Author</b>: ${fileInfo.metadata.author}</Typography>}
            {fileInfo.metadata.hashTags && <FileHashTags hashTags={fileInfo.metadata.hashTags}
                                                         onHashTagClick={onHashTagClick}
            />}
            <Typography variant="body1">
                <b>Mime type:</b> {fileInfo.mimeType}
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
