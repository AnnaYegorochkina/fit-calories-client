import {obj, ACTIONS} from '../../actions/fitCalories/planView';

const initialState = {
    fetching: true,
    obj: obj,
    planRecords: [],
    selectedPlan: {},
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case `${obj}/${ACTIONS.SET_FETCHING}`:
            return {
                ...state,
                fetching: action.payload,
            };

        case `${obj}/${ACTIONS.SET_PLAN_RECORDS}`:
            return {
                ...state,
                planRecords: action.payload,
            };

        case `${obj}/${ACTIONS.SET_SELECTED_PLAN}`:
            return {
                ...state,
                selectedPlan: action.payload,
            };

        default:
            return state
    }
}

export default reducer;
