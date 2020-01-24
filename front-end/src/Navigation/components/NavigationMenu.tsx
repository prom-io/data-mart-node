import React, {FunctionComponent} from "react";
import {inject} from "mobx-react";
import {createStyles, List, ListItemIcon, ListItemText, makeStyles, MenuItem} from "@material-ui/core";
import HistoryIcon from "@material-ui/icons/History"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import {IAppState} from "../../store";
import {Routes} from "../../router";

const {Link} = require("mobx-router");

interface NavigationMenuMobxProps {
    store?: any
}

interface NavigationMenuOwnProps {
    onItemClick?: () => void
}

type NavigationMenuProps = NavigationMenuMobxProps & NavigationMenuOwnProps;

const useStyles = makeStyles(() => createStyles({
    undecoratedLink: {
        textDecoration: "none",
        color: "inherit"
    }
}));

const _DataValidatorNavigationMenu: FunctionComponent<NavigationMenuProps> = ({
    store,
    onItemClick
}) => {
    const classes = useStyles();

    return (
        <List>
            <Link store={store}
                  view={Routes.home}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <HistoryIcon/>
                    </ListItemIcon>
                    <ListItemText>
                        Data purchases
                    </ListItemText>
                </MenuItem>
            </Link>
            <Link store={store}
                  view={Routes.files}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <InsertDriveFileIcon/>
                    </ListItemIcon>
                    <ListItemText>
                        Explore files
                    </ListItemText>
                </MenuItem>
            </Link>
            <Link store={store}
                  view={Routes.wallets}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <AccountBalanceWalletIcon/>
                    </ListItemIcon>
                    <ListItemText>
                        Wallets
                    </ListItemText>
                </MenuItem>
            </Link>
            {process.env.REACT_APP_KIBANA_DASHBOARD_URL && (
                <a href={`${process.env.REACT_APP_KIBANA_DASHBOARD_URL}`}
                   target="_blank"
                   className={classes.undecoratedLink}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText>
                            Kibana Dashboard
                        </ListItemText>
                    </MenuItem>
                </a>
            )}
        </List>
    )
};

const mapMobxToProps = (state: IAppState): NavigationMenuMobxProps => ({
    store: state.store
});

export const NavigationMenu = inject(mapMobxToProps)(_DataValidatorNavigationMenu) as FunctionComponent<NavigationMenuOwnProps>;
