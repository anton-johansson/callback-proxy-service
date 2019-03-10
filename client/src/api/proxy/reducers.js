import {
    GET_TARGET_PENDING,
    GET_TARGET_FULFILLED,
    GET_TARGET_REJECTED,
    SET_TARGET_PENDING,
    SET_TARGET_FULFILLED,
    SET_TARGET_REJECTED,
    PROXY_RESET
} from './actions';

const proxy = (
    state = {
        isLoading: false,
        target: ''
    },
    action
) => {
    switch (action.type) {
        case PROXY_RESET:
            return {
                ...state,
                isLoading: false,
                target: ''
            };
        case GET_TARGET_PENDING:
        case SET_TARGET_PENDING:
            return {
                ...state,
                isLoading: true
            };
        case SET_TARGET_FULFILLED:
        case GET_TARGET_FULFILLED:
            return {
                ...state,
                isLoading: false,
                target: action.target
            };
        case GET_TARGET_REJECTED:
        case SET_TARGET_REJECTED:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}

export default proxy;
