import React, {FunctionComponent, Fragment} from "react";
import {inject, observer} from "mobx-react";
import {Chip, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {IAppState} from "../../store";

interface SearchHashTagsMobxProps {
    tags: string[],
    removeTag: (tagIndex: number) => void,
    clearTags: () => void
}

const _SearchHashTags: FunctionComponent<SearchHashTagsMobxProps> = ({
    tags,
    removeTag,
    clearTags
}) => {
    return (
        <div>
            {tags.map((tag, index) => (
                <Chip label={tag}
                      onDelete={() => removeTag(index)}
                      key={index}
                      size="medium"
                />
            ))}
            {tags.length !== 0 && (
                <IconButton onClick={clearTags}>
                    <CloseIcon/>
                </IconButton>
            )}
        </div>
    )
};

const mapMobxToProps = (state: IAppState): SearchHashTagsMobxProps => ({
    tags: state.filesSearch.tags,
    removeTag: state.filesSearch.removeTagByIndex,
    clearTags: state.filesSearch.clearTags
});

export const SearchHashTags = inject(mapMobxToProps)(observer(_SearchHashTags) as FunctionComponent<{}>);
