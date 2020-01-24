import React from "react";
import {FilesPage, NotFoundPage, TransactionsPage, WalletsPage} from "../pages";
import {store} from "../store";

const Route = require("mobx-router").Route;

export const Routes = {
    home: new Route({
        path: "/",
        component: <TransactionsPage/>,
        beforeEnter: () => {
            store.transactions.fetchTransactions();
        }
    }),
    notFound: new Route({
        path: "/404",
        component: <NotFoundPage/>
    }),
    files: new Route({
        path: "/files",
        component: <FilesPage/>,
        beforeEnter: () => {
            store.filesSearch.searchFiles()
        }
    }),
    transactions: new Route({
        path: "/data-purchases",
        component: <TransactionsPage/>,
        beforeEnter: () => {
            store.transactions.fetchTransactions();
            store.transactions.setRefreshOnDefaultAccountChange(true);
        },
        onExit: () => {
            store.transactions.setRefreshOnDefaultAccountChange(false);
        }
    }),
    wallets: new Route({
        path: "/wallets",
        component: <WalletsPage/>
    })
};
