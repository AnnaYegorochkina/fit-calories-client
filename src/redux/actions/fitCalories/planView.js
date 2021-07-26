import {reduxAction} from '../../../Utils';

export const obj = `fitCalories/planView`;

export const ACTIONS = {
    SET_FETCHING: `SET_FETCHING`,
    SET_PLAN_RECORDS: `SET_PLAN_RECORDS`,
    SET_SELECTED_PLAN: `SET_SELECTED_PLAN`,
};

export const setFetching = (fetching) => reduxAction(obj, ACTIONS.SET_FETCHING, fetching);
export const setPlanRecords = (records) => reduxAction(obj, ACTIONS.SET_PLAN_RECORDS, records);
export const setSelectedPlan = (plan) => reduxAction(obj, ACTIONS.SET_SELECTED_PLAN, plan);

export const produceDispatcherPlanViewActions = (dispatch) => {
    return {
        setFetching: (fetching) => {
            return dispatch(setFetching(fetching))
        },
        setPlanRecords: (records) => {
            return dispatch(setPlanRecords(records))
        },
        setSelectedPlan: (plan) => {
            return dispatch(setSelectedPlan(plan))
        },
    }
};