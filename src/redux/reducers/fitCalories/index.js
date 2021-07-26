import {combineReducers} from 'redux';

import mainPage from './mainPage';
import planView from './planView';

const fitCalories = combineReducers({
    mainPage,
    planView,
});

export default fitCalories;
