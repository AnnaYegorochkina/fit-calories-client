import React from 'react';

import {NotificationContext} from '../AppContext/index';

const NotificationSystemConsumer = Component => {
    return class extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            const {forwardedRef, ...rest} = this.props;

            return (<NotificationContext.Consumer>{
                (appContext) => <Component ref={forwardedRef} notificationSystemProvider={appContext} {...rest}/>
            }
            </NotificationContext.Consumer>)
        }
    }
};

export default NotificationSystemConsumer;
