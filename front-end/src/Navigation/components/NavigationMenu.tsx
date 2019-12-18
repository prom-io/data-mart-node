import React, {FunctionComponent} from "react";
import {inject} from "mobx-react";
import {List, ListItemIcon, ListItemText, MenuItem} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
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

const _DataValidatorNavigationMenu: FunctionComponent<NavigationMenuProps> = ({
    store,
    onItemClick
}) => (
    <List>
        <Link store={store}
              view={Routes.home}
              style={{
                  textDecoration: 'none',
                  color: 'inherit'
              }}
        >
            <MenuItem onClick={() => onItemClick && onItemClick()}>
                <ListItemIcon>
                    <HomeIcon/>
                </ListItemIcon>
                <ListItemText>
                    Home
                </ListItemText>
            </MenuItem>
        </Link>
        <Link store={store}
              view={Routes.files}
              style={{
                  textDecoration: 'none',
                  color: 'inherit'
              }}
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
              view={Routes.dataMartRegistration}
              style={{
                  textDecoration: 'none',
                  color: 'inherit'
              }}
        >
            <MenuItem onClick={() => onItemClick && onItemClick()}>
                <ListItemIcon>
                    <AccountCircleIcon/>
                </ListItemIcon>
                <ListItemText>
                    Register
                </ListItemText>
            </MenuItem>
        </Link>
        {process.env.REACT_APP_KIBANA_DASHBOARD_URL && (
            <a href={`${process.env.REACT_APP_KIBANA_DASHBOARD_URL}`}
               target="_blank"
               style={{
                   textDecoration: 'none',
                   color: 'inherit'
               }}
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
);

const mapMobxToProps = (state: IAppState): NavigationMenuMobxProps => ({
    store: state.store
});

export const NavigationMenu = inject(mapMobxToProps)(_DataValidatorNavigationMenu) as FunctionComponent<NavigationMenuOwnProps>;
