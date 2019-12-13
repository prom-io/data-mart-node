import React, {FunctionComponent} from "react";
import {Grid, Hidden} from "@material-ui/core";
import {AppBar} from "../AppBar";
import {Layout} from "../Layout";
import {NavigationMenu} from "../Navigation";
import {Footer} from "../Footer";
import {SelectedDataMartBalance} from "../Account";
import {PurchasableFilesSearchList} from "../DataPurchase";

export const FilesPage: FunctionComponent<{}> = () => (
    <Grid container>
        <Grid item xs={12}>
            <AppBar sideBarItem={<SelectedDataMartBalance/>}/>
        </Grid>
        <Hidden mdDown>
            <Grid item lg={2}>
                <NavigationMenu/>
            </Grid>
        </Hidden>
        <Grid item xs={12} lg={10}>
            <Layout>
                <PurchasableFilesSearchList/>
            </Layout>
        </Grid>
        <Grid item xs={12}>
            <Footer/>
        </Grid>
    </Grid>
);
