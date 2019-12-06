import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {TypographyProps} from "@material-ui/core/Typography";
import {AccountBalance} from "./AccountBalance";
import {IAppState} from "../../store";

interface SelectedDataMartBalanceMobxProps {
    balance: number,
    selectedDataMart?: string
}

type SelectedDataMartBalanceProps = SelectedDataMartBalanceMobxProps & TypographyProps;

const _SelectedDataMartBalance: FunctionComponent<SelectedDataMartBalanceProps> = ({
    selectedDataMart,
    balance,
    ...rest
}) => {
    return selectedDataMart
        ? <AccountBalance balance={balance} {...rest}/>
        : null;
};

const mapMobxToProps = (state: IAppState): SelectedDataMartBalanceMobxProps => ({
    balance: state.settings.selectedDataMartAccount
        ? state.balances.accountsBalances[state.settings.selectedDataMartAccount] || 0
        : 0,
    selectedDataMart: state.settings.selectedDataMartAccount
});

export const SelectedDataMartBalance = inject(mapMobxToProps)(observer(_SelectedDataMartBalance)) as FunctionComponent<any>;
