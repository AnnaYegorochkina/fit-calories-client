import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import {makeStyles} from '@material-ui/core';

import {Router, Switch, Route, Redirect} from 'react-router';

import {Provider} from 'react-redux';

import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import {ConnectedRouter, connectRouter, routerMiddleware} from 'connected-react-router';
import {createHashHistory} from 'history';

import MomentUtils from '@date-io/moment';
import 'moment/locale/ru';
import moment from 'moment';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import ProviderNotificationSystemNotistack from './common/ProviderNotificationSystemNotistack';
import Theme from './common/Theme';

import reducers from './redux/reducers';

const useStyles = makeStyles(() => ({
    '@global': {
        html: {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            fontFamily: 'Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif',
        },
        body: {
            margin: 0,
        },
        '#mount-point': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            overflow: 'hidden',
            backgroundColor: "#FFF",
        },
    },
}));

const history = createHashHistory();

const reducerCombine = combineReducers({
    router: connectRouter(history),
    reducers
});

const store = createStore(
    reducerCombine,
    {},
    composeWithDevTools(
        applyMiddleware(
            routerMiddleware(history), // for dispatching history actions
            thunk
        )
    )
);

const Loader = () => {
    return <div style={{margin: 10}}>{"Загрузка модуля..."}</div>
};

const FitCaloriesMainPageLazy = lazy(() => import(/* webpackChunkName: "c1" */ './components/fitCalories/FitCaloriesMainPage'));
const PlanViewLazy = lazy(() => import(/* webpackChunkName: "c2" */ './components/fitCalories/PlanView'));

function FitCaloriesMainPage(props) {
    return <Suspense fallback={<Loader/>}>
        <FitCaloriesMainPageLazy {...props}/>
    </Suspense>
}

function PlanView(props) {
    return <Suspense fallback={<Loader/>}>
        <PlanViewLazy {...props}/>
    </Suspense>
}

function Main() {
    useStyles();

    return <ProviderNotificationSystemNotistack>
        <Provider store={store}>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="ru" libInstance={moment}>
                <ConnectedRouter history={history}> {/* place ConnectedRouter under Provider */}
                    <Router history={history}>
                        <Theme>
                            <App>
                                <Switch>
                                    <Route exact path={`/fitCalories`} render={props => {
                                        return <FitCaloriesMainPage
                                            {...props} />
                                    }}/>

                                    <Route exact path={`/fitCalories/planView/:planId`} render={props => {
                                        const planId = props.match.params['planId'];

                                        return <PlanView
                                            planId={planId}
                                            {...props} />
                                    }}/>

                                    <Redirect from={'/'} exact to={'/fitCalories'}/>
                                </Switch>
                            </App>
                        </Theme>
                    </Router>
                </ConnectedRouter>
            </MuiPickersUtilsProvider>
        </Provider>
    </ProviderNotificationSystemNotistack>
}

ReactDOM.render(<Main/>, document.getElementById('mount-point'));
