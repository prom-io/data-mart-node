import React, {FunctionComponent} from "react";
import {Typography} from "@material-ui/core";

interface FileHashTagsProps {
    hashTags: string[],
    onHashTagClick: (hashTag: string) => void
}

export const FileHashTags: FunctionComponent<FileHashTagsProps> = ({hashTags, onHashTagClick}) => {
    const handleHashTagClick = (hashTag: string): void => onHashTagClick(hashTag);

    return (
        <Typography variant="body1" style={{cursor: "pointer"}}>
            {hashTags.map(hashTag => (<span onClick={() => handleHashTagClick(hashTag)}><u>#{hashTag}</u> </span>))}
        </Typography>
    )
};
