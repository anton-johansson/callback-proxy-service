import {
    GET_CONFIG_PENDING,
    GET_CONFIG_FULFILLED,
    GET_CONFIG_REJECTED
} from './actions';

const config = (
    state = {
        isLoading: false,
        proxyEndpoint: '',
        suggestionPath: ''
    },
    action
) => {
    switch (action.type) {
        case GET_CONFIG_PENDING:
            return {
                ...state,
                isLoading: true
            };
        case GET_CONFIG_FULFILLED:
            return {
                ...state,
                isLoading: false,
                proxyEndpoint: action.proxyEndpoint,
                suggestionPath: action.suggestionPath
            };
        case GET_CONFIG_REJECTED:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}

export default config;
