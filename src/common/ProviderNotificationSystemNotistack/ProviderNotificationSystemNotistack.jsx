import React, {Component} from 'react';
import * as PropTypes from 'prop-types';

import {SnackbarProvider} from 'notistack';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {NotificationContext} from '../AppContext/index';

class ProviderNotificationSystemNotistack extends Component {
    constructor(props) {
        super(props);

        this.refSnack = React.createRef();
    }

    showSnackBar = (msg, level, autoDismiss) => {
        const actionDismiss = (key) => (
            <IconButton onClick={() => {
                this.refSnack.current.closeSnackbar(key)
            }}>
                <CloseIcon/>
            </IconButton>
        );

        this.refSnack.current.enqueueSnackbar(msg, {
            variant: level,
            autoHideDuration: autoDismiss === 0 ? null : (autoDismiss * 1000),
            action: actionDismiss,
        });
    };

    showSnackBarSuccess = (msg) => {
        this.showSnackBar(msg, 'success', 5);
    };

    showSnackBarError = (msg) => {
        this.showSnackBar(msg, 'error', 0);
    };

    showSnackBarWarning = (msg) => {
        this.showSnackBar(msg, 'warning', 7);
    };

    showSnackBarInfo = (msg) => {
        this.showSnackBar(msg, 'info', 5);
    };

    clearAllSnackBars = () => {
        this.refSnack.current.closeSnackbar();
    };

    state = {
        showSnackBarSuccess: this.showSnackBarSuccess,
        showSnackBarError: this.showSnackBarError,
        showSnackBarWarning: this.showSnackBarWarning,
        showSnackBarInfo: this.showSnackBarInfo,
        clearAllSnackBars: this.clearAllSnackBars,
        showSnackBar: this.showSnackBar,
    };

    render() {
        return (
            <SnackbarProvider ref={this.refSnack}>
                <NotificationContext.Provider value={this.state}>
                    {this.props.children}
                </NotificationContext.Provider>
            </SnackbarProvider>
        )
    }
}

ProviderNotificationSystemNotistack.propTypes = {
    position: PropTypes.string.isRequired,
};

ProviderNotificationSystemNotistack.defaultProps = {
    position: 'tr',
};

export default ProviderNotificationSystemNotistack;
