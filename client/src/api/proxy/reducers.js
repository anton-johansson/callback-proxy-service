import {GET_TARGET_FULFILLED, SET_TARGET_FULFILLED, PROXY_RESET} from './actions';

const proxy = (
    state = {
        target: undefined
    },
    action
) => {
    switch (action.type) {
        case PROXY_RESET:
            return {
                ...state,
                target: undefined
            };
        case SET_TARGET_FULFILLED:
        case GET_TARGET_FULFILLED:
            return {
                ...state,
                target: action.target
            };
        default:
            return state;
    }
}

export default proxy;
