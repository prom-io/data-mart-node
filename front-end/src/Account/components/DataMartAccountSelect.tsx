import React, {FunctionComponent, Fragment} from "react";
import {Select, InputLabel, MenuItem} from "@material-ui/core";

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
            Data mart account
        </InputLabel>
        <Select onChange={event => onSelect(event.target.value as string)}
                value={selectedAccount}
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
