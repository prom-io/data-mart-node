import React from "react";
import {DataMartRegistrationPage, FilesPage, NotFoundPage, TransactionsPage} from "../pages";
import {store} from "../store";

const Route = require("mobx-router").Route;

export const Routes = {
    home: new Route({
        path: '/',
        component: <TransactionsPage/>,
        beforeEnter: () => {
            store.transactions.fetchTransactions();
        }
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
    transactions: new Route({
        path: '/data-purchases',
        component: <TransactionsPage/>,
        beforeEnter: () => {
            store.transactions.fetchTransactions();
        }
    })
};
