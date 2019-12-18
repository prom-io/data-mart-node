import React, {FunctionComponent} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    IconButton,
    makeStyles,
    Tooltip,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {FileHashTags} from "./FileHashTags";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";
import {makePreciseNumberString} from "../../utils";

interface FileCardProps {
    fileInfo: FileInfoResponse,
    onPurchase?: (fileInfo: FileInfoResponse) => void,
    purchasePending?: boolean,
    purchaseError?: ApiError,
    displayPurchaseButton?: boolean,
    onHashTagClick: (tag: string) => void,
    onDetailsRequest: () => void
}

const useStyles = makeStyles(() => createStyles({
    fileCard: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    fileCardContent: {
        display: "flex-end",
        flex: "1 0 auto",
        alignItems: "flex-end"
    },
    fileCardActions: {
        display: "flex",
        justifyContent: "space-between"
    }
}));

export const FileCard: FunctionComponent<FileCardProps> = ({
    fileInfo,
    onPurchase,
    purchasePending,
    purchaseError,
    displayPurchaseButton = false,
    onHashTagClick,
    onDetailsRequest
}) => {
    const classes = useStyles();

    return (
        <Card className={classes.fileCard}>
            <CardHeader title={(
                <Typography variant="h6" noWrap>
                    {fileInfo.metadata.briefDescription ? fileInfo.metadata.briefDescription : `${fileInfo.name}`}
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
            <CardContent className={classes.fileCardContent}>
                <Typography variant="body1">
                    <b>Price</b>: {makePreciseNumberString(fileInfo.price)} PROM
                </Typography>
                {fileInfo.metadata.author && <Typography variant="body1"><b>Author</b>: {fileInfo.metadata.author}</Typography>}
                {fileInfo.metadata.hashTags && <FileHashTags hashTags={fileInfo.metadata.hashTags}
                                                             onHashTagClick={onHashTagClick}
                />}
                <Typography variant="body1">
                    <b>Mime type:</b> {fileInfo.mimeType}
                </Typography>
            </CardContent>
            {displayPurchaseButton && (
                <CardActions className={classes.fileCardActions}>
                    <div>
                        <Button variant="contained"
                                color="primary"
                                disabled={purchasePending}
                                onClick={() => onPurchase && onPurchase(fileInfo)}
                        >
                            Purchase
                        </Button>
                        {purchasePending && <CircularProgress size={15} color="primary"/>}
                    </div>
                </CardActions>
            )}
        </Card>
    );
};
