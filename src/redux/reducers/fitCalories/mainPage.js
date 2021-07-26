import {obj, ACTIONS} from '../../actions/fitCalories/mainPage';

const initialState = {
    fetching: true,
    obj: obj,
    plans: [],
    selectedPlan: {},
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case `${obj}/${ACTIONS.SET_FETCHING}`:
            return {
                ...state,
                fetching: action.payload,
            };

        case `${obj}/${ACTIONS.SET_PLANS}`:
            return {
                ...state,
                plans: action.payload,
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
