import {GET_PROXY_ENDPOINT_FULFILLED} from './actions';

const proxy = (
    state = {
        endpoint: undefined
    },
    action
) => {
    switch (action.type) {
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
