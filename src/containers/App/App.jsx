import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    appFrame: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    content: {
        paddingTop: 0,
        height: 'calc(100%)',
        marginTop: 0,
        overflow: 'hidden',
    },
}));

function App(props) {
    const classes = useStyles();

    return (
        <div className={classes.appFrame}>
            <div className={classes.content} style={{marginLeft: 0}}>
                {props.children}
            </div>
        </div>
    )
}

export default App;