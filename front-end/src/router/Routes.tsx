import * as React from "react";
import {DataMartRegistrationPage, FilesPage, HomePage, NotFoundPage} from "../pages";
import {store} from "../store";

const Route = require("mobx-router").Route;

export const Routes = {
    home: new Route({
        path: '/',
        component: <HomePage/>
    }),
    notFound: new Route({
        path: '/404',
        component: <NotFoundPage/>
    }),
    files: new Route({
        path: '/files',
        component: <FilesPage/>,
        beforeEnter: () => {
            store.filesSearch.searchFiles()
        }
    }),
    dataMartRegistration: new Route({
        path: '/registration',
        component: <DataMartRegistrationPage/>
    }),
};
