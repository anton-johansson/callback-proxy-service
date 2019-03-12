import {
    GET_CALLBACK_HISTORY_PENDING,
    GET_CALLBACK_HISTORY_FULFILLED,
    GET_CALLBACK_HISTORY_REJECTED,
    SET_SELECTED_CALLBACK_HISTORY_FULFILLED
} from './actions';

const history = (
    state = {
        isLoading: false,
        selectedCallbackHistoryIndex: -1,
        callbackHistory: []
    },
    action
) => {
    switch (action.type) {
        case GET_CALLBACK_HISTORY_PENDING:
            return {
                ...state,
                isLoading: true
            };
        case GET_CALLBACK_HISTORY_FULFILLED:
            return {
                ...state,
                isLoading: false,
                callbackHistory: action.callbackHistory
            };
        case GET_CALLBACK_HISTORY_REJECTED:
            return {
                ...state,
                isLoading: false
            };
        case SET_SELECTED_CALLBACK_HISTORY_FULFILLED:
            return {
                ...state,
                selectedCallbackHistoryIndex: action.selectedCallbackHistoryIndex
            }
        default:
            return state;
    }
}

export default history;
