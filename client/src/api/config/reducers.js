import {GET_CONFIG_FULFILLED} from './actions';

const config = (
    state = {
        proxyEndpoint: '',
        suggestionPath: ''
    },
    action
) => {
    switch (action.type) {
        case GET_CONFIG_FULFILLED:
            return {
                ...state,
                proxyEndpoint: action.proxyEndpoint,
                suggestionPath: action.suggestionPath
            };
        default:
            return state;
    }
}

export default config;
