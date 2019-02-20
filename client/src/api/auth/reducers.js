import {RECEIVE_AUTHENTICATION} from './actions';

const authentication = (
    state = {
        username: ''
    },
    action
) => {
    switch (action.type) {
        case RECEIVE_AUTHENTICATION:
            return {
                ...state,
                username: action.username
            };
        default:
            return state;
    }
}

export default authentication;
