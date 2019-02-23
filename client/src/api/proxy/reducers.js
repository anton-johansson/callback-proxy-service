import {GET_PROXY_ENDPOINT_FULFILLED, SET_PROXY_ENDPOINT_FULFILLED} from './actions';

const proxy = (
    state = {
        endpoint: undefined
    },
    action
) => {
    switch (action.type) {
        case SET_PROXY_ENDPOINT_FULFILLED:
        case GET_PROXY_ENDPOINT_FULFILLED:
            return {
                ...state,
                endpoint: action.endpoint
            };
        default:
            return state;
    }
}

export default proxy;
