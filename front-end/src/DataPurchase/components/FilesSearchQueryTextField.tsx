import React, {FunctionComponent, Fragment} from "react";
import {inject, observer} from "mobx-react";
import {TextField, InputAdornment, IconButton} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {IAppState} from "../../store";

interface FilesSearchQueryTextFieldMobxProps {
    searchQuery: string,
    updateSearchQuery: (query: string) => void,
    search: () => void
}

const _FilesSearchQueryTextField: FunctionComponent<FilesSearchQueryTextFieldMobxProps> = ({
    searchQuery,
    updateSearchQuery,
    search
}) => {
    return (
        <div style={{display: "inline"}}>
            <TextField label="Search"
                       margin="dense"
                       fullWidth
                       value={searchQuery}
                       onChange={event => updateSearchQuery(event.target.value as string)}
                       InputProps={{
                           endAdornment: (
                               <Fragment>
                                   <InputAdornment position="end">
                                       <IconButton onClick={search}>
                                           <SearchIcon/>
                                       </IconButton>
                                   </InputAdornment>
                                   <IconButton onClick={() => {
                                       updateSearchQuery("");
                                       search();
                                   }}>
                                       <CloseIcon/>
                                   </IconButton>
                               </Fragment>
                           )
                       }}
                />
        </div>
    )
};

const mapMobxToProps = (state: IAppState): FilesSearchQueryTextFieldMobxProps => ({
    updateSearchQuery: state.filesSearch.setQuery,
    search: state.filesSearch.searchFiles,
    searchQuery: state.filesSearch.query
});

export const FilesSearchQueryTextField = inject(mapMobxToProps)(observer(_FilesSearchQueryTextField) as FunctionComponent<{}>);
