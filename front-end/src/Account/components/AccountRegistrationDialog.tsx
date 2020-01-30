import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {RegisterAccountRequest} from "../../models";
import {FormErrors} from "../../utils";
import {ApiError, DATA_MART_API_UNREACHABLE_CODE} from "../../api";
import {IAppState} from "../../store";

interface AccountRegistrationDialogMobxProps {
    registrationForm: Partial<RegisterAccountRequest>,
    formErrors: FormErrors<RegisterAccountRequest>,
    submissionError?: ApiError,
    pending: boolean,
    registrationDialogOpen: boolean,
    showSnackbar: boolean,
    setFormValue: (key: keyof RegisterAccountRequest, value: string) => void,
    setRegistrationDialogOpen: (registrationDialogOpen: boolean) => void,
    setShowSnackbar: (showSnackbar: boolean) => void,
    registerAccount: () => void
}

type AccountRegistrationDialogInjectedProps = WithMobileDialog & WithSnackbarProps;

type AccountRegistrationDialogProps = AccountRegistrationDialogMobxProps & AccountRegistrationDialogInjectedProps;

const getSubmissionErrorLabel = (error: ApiError): string => {
    if (error.status === 403) {
        return "Account with such address has already been registered and it's not data mart";
    } else if (error.status === 409) {
        return "Account with such address has already been registered to this node";
    } else if (error.status === DATA_MART_API_UNREACHABLE_CODE) {
        return "Data Mart API could not be reached. Make sure that it's running"
    } else {
        return `Unknown error occurred when tried to register account. Server responded with ${error.status} status`;
    }
};

const _AccountRegistrationDialog: FunctionComponent<AccountRegistrationDialogProps> = ({
    registrationForm,
    formErrors,
    submissionError,
    pending,
    registrationDialogOpen,
    showSnackbar,
    setFormValue,
    setRegistrationDialogOpen,
    setShowSnackbar,
    registerAccount,
    fullScreen,
    enqueueSnackbar
}) => {
    if (showSnackbar) {
        enqueueSnackbar("Account has been successfully registered");
        setShowSnackbar(false);
        setRegistrationDialogOpen(false);
    }

    return (
        <Dialog open={registrationDialogOpen}
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
                onClose={() => setRegistrationDialogOpen(false)}
        >
            <DialogTitle>Add wallet</DialogTitle>
            <DialogContent>
                <TextField label="Address"
                           value={registrationForm.address}
                           onChange={event => setFormValue("address", event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(formErrors.address)}
                           helperText={formErrors.address && formErrors.address}
                />
                <TextField label="Private key"
                           value={registrationForm.privateKey}
                           onChange={event => setFormValue("privateKey", event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(formErrors.privateKey)}
                           helperText={formErrors.privateKey && formErrors.privateKey}
                           multiline
                />
                {submissionError && (
                    <Typography variant="body1" style={{color: "red"}}>
                        {getSubmissionErrorLabel(submissionError)}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined"
                        color="secondary"
                        onClick={() => setRegistrationDialogOpen(false)}
                >
                    Cancel
                </Button>
                <Button variant="contained"
                        color="primary"
                        onClick={registerAccount}
                        disabled={pending}
                >
                    Register
                </Button>
                {pending && <CircularProgress color="primary" size={15}/>}
            </DialogActions>
        </Dialog>
    )
};

const mapMobxToProps = (state: IAppState): AccountRegistrationDialogMobxProps => ({
    registrationForm: state.registration.registrationForm,
    formErrors: state.registration.formErrors,
    submissionError: state.registration.submissionError,
    showSnackbar: state.registration.showSnackbar,
    pending: state.registration.pending,
    registrationDialogOpen: state.registration.registrationDialogOpen,
    registerAccount: state.registration.registerAccount,
    setRegistrationDialogOpen: state.registration.setRegistrationDialogOpen,
    setFormValue: state.registration.setField,
    setShowSnackbar: state.registration.setShowSnackbar
});

export const AccountRegistrationDialog = withMobileDialog()(
    withSnackbar(
        inject(mapMobxToProps)(observer(_AccountRegistrationDialog) as FunctionComponent)
    )
);
