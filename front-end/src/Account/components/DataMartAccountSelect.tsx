import React, {Fragment, FunctionComponent} from "react";
import {InputLabel, MenuItem, Select} from "@material-ui/core";

interface DataMartAccountSelectProps {
    accounts: string[],
    onSelect: (address: string) => void,
    selectedAccount?: string
}

export const DataMartAccountSelect: FunctionComponent<DataMartAccountSelectProps> = ({
    accounts,
    onSelect,
    selectedAccount
}) => (
    <Fragment>
        <InputLabel htmlFor="dataMartAccountSelect">
            Wallet
        </InputLabel>
        <Select onChange={event => onSelect(event.target.value as string)}
                value={selectedAccount || ""}
        >
            {accounts.map(account => (
                <MenuItem key={account}
                          value={account}
                >
                    {account}
                </MenuItem>
            ))}
        </Select>
    </Fragment>
);
