import {LOGOUT, RECEIVE_AUTHENTICATION} from './actions';

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
        case LOGOUT:
            return {
                ...state,
                username: ''
            }
        default:
            return state;
    }
}

export default authentication;
