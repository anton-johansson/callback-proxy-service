import {
    CHECK_AUTHENTICATION_PENDING,
    CHECK_AUTHENTICATION_FULFILLED,
    CHECK_AUTHENTICATION_REJECTED,
    LOGIN_PENDING,
    LOGIN_FULFILLED,
    LOGIN_REJECTED,
    LOGOUT_PENDING,
    LOGOUT_FULFILLED,
    LOGOUT_REJECTED
} from './actions';

const authentication = (
    state = {
        isLoading: false,
        username: '',
        name: '',
        clientAddress: '',
        clientHostname: ''
    },
    action
) => {
    switch (action.type) {
        case CHECK_AUTHENTICATION_PENDING:
        case LOGIN_PENDING:
        case LOGOUT_PENDING:
            return {
                ...state,
                isLoading: true
            };
        case CHECK_AUTHENTICATION_FULFILLED:
            const authentication = action.authentication || {};
            return {
                ...state,
                isLoading: false,
                username: authentication.username,
                name: authentication.name,
                clientAddress: authentication.clientAddress,
                clientHostname: authentication.clientHostname
            };
        case CHECK_AUTHENTICATION_REJECTED:
        case LOGIN_FULFILLED:
        case LOGIN_REJECTED:
            return {
                ...state,
                isLoading: false
            };
        case LOGOUT_FULFILLED:
        case LOGOUT_REJECTED:
        return {
            ...state,
            isLoading: false,
            username: '',
            name: '',
            clientAddress: '',
            clientHostname: ''
        };
        default:
            return state;
    }
}

export default authentication;
