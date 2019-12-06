import * as React from "react";
import {MuiThemeProvider} from "@material-ui/core";
import {SnackbarProvider} from "notistack";
import {red} from "./themes";

const {MobxRouter} = require("mobx-router");

export const App: React.FC = () => (
    <div id="app">
        <SnackbarProvider maxSnack={3}>
            <MuiThemeProvider theme={red}>
                <MobxRouter/>
            </MuiThemeProvider>
        </SnackbarProvider>
    </div>
);
