import {RECEIVE_AUTHENTICATION} from './actions';

const authentication = (
    state = {
        username: undefined,
        name: undefined
    },
    action
) => {
    switch (action.type) {
        case RECEIVE_AUTHENTICATION:
            const authentication = action.authentication || {};
            return {
                ...state,
                username: authentication.username,
                name: authentication.name,
                clientAddress: authentication.clientAddress,
                clientHostname: authentication.clientHostname
            };
        default:
            return state;
    }
}

export default authentication;
