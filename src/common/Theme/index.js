import React from 'react';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const themeProps = {
    primaryColor: '#05396b',
    secondaryColor: '#5cdb94'
};

export function getThemeProps(){
    return themeProps;
}

export function setThemeProps({primaryColor, secondaryColor}){
    themeProps[`primaryColor`] = primaryColor;
    themeProps[`secondaryColor`] = secondaryColor;
}

function MTheme(props) {
    const {primaryColor: primary, secondaryColor: secondary} = getThemeProps();

    const index = createMuiTheme({
        typography: {
            useNextVariants: true,
        },
        palette: {
            primary: {
                main: primary,
            },
            secondary: {
                main: secondary,
            },
        },
        overrides: {
            MuiTooltip: {
                tooltip: {
                    fontSize: '1.2rem !important',
                }
            },
        },
    });

    return <MuiThemeProvider theme={index}>
        {props.children}
    </MuiThemeProvider>
}

export default MTheme;
