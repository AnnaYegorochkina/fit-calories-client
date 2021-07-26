import {reduxAction} from '../../../Utils';

export const obj = `fitCalories/mainPage`;

export const ACTIONS = {
    SET_FETCHING: `SET_FETCHING`,
    SET_PLANS: `SET_PLANS`,
    SET_SELECTED_PLAN: `SET_SELECTED_PLAN`,
};

export const setFetching = (fetching) => reduxAction(obj, ACTIONS.SET_FETCHING, fetching);
export const setPlans = (plans) => reduxAction(obj, ACTIONS.SET_PLANS, plans);
export const setSelectedPlan = (plan) => reduxAction(obj, ACTIONS.SET_SELECTED_PLAN, plan);

export const produceDispatcherMainPageActions = (dispatch) => {
    return {
        setFetching: (fetching) => {
            return dispatch(setFetching(fetching))
        },
        setPlans: (plans) => {
            return dispatch(setPlans(plans))
        },
        setSelectedPlan: (plan) => {
            return dispatch(setSelectedPlan(plan))
        },
    }
};