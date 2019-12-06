import React, {FunctionComponent} from "react";
import {createAccountRegistrationForm} from "./createAccountRegistrationForm";

export const DataMartRegistrationForm: FunctionComponent<{}> = createAccountRegistrationForm({
    label: "Register data mart",
    storeName: "dataMartRegistration"
});
