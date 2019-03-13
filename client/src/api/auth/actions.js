import ky from 'ky';
import {reset as resetProxy} from '../proxy/actions';
import {setScene} from '../scene/actions';
import {apiURL} from '../../util';

export const CHECK_AUTHENTICATION_PENDING = 'CHECK_AUTHENTICATION_PENDING';
const checkAuthenticationPending = () => ({
    type: CHECK_AUTHENTICATION_PENDING
});

export const CHECK_AUTHENTICATION_FULFILLED = 'CHECK_AUTHENTICATION_FULFILLED';
const checkAuthenticationFulfilled = authentication => ({
    type: CHECK_AUTHENTICATION_FULFILLED,
    authentication
});

export const CHECK_AUTHENTICATION_REJECTED = 'CHECK_AUTHENTICATION_REJECTED';
const checkAuthenticationRejected = () => ({
    type: CHECK_AUTHENTICATION_REJECTED
});

export const checkAuthentication = () => {
    return dispatch => {
        dispatch(checkAuthenticationPending());

        return ky.get(`${apiURL}/api/check-authenticated`, {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const authentication = await response.json();
                    console.log('Is authenticated as', authentication.username);
                    dispatch(checkAuthenticationFulfilled(authentication));
                    dispatch(setScene('main'));
                } else {
                    console.log('Is not authenticated');
                    dispatch(checkAuthenticationRejected());
                }
            })
            .catch(err => {
                console.log('Error checking authentication:', err);
                dispatch(checkAuthenticationRejected());
            })
    };
}

export const LOGIN_PENDING = 'LOGIN_PENDING';
const loginPending = () => ({
    type: LOGIN_PENDING
});

export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
const loginFulfilled = () => ({
    type: LOGIN_FULFILLED
});

export const LOGIN_REJECTED = 'LOGIN_REJECTED';
const loginRejected = () => ({
    type: LOGIN_REJECTED
});

export const login = (username, password) => {
    return dispatch => {
        dispatch(loginPending());

        const options = {
            credentials: 'include',
            json: {
                username,
                password
            }
        };

        return ky.post(`${apiURL}/api/authenticate`, options)
            .then(async response => {
                if (response.status === 200) {
                    console.log('Successfully logged in, checking credentials');
                    dispatch(loginFulfilled());
                    dispatch(checkAuthentication());
                } else {
                    console.log('Bad credentials');
                    dispatch(loginRejected());
                }
            })
            .catch(err => {
                console.log('Error authenticating:', err);
                dispatch(loginRejected());
            });
    };
};

export const LOGOUT_PENDING = 'LOGOUT_PENDING';
const logoutPending = () => ({
    type: LOGOUT_PENDING
});

export const LOGOUT_FULFILLED = 'LOGOUT_FULFILLED';
const logoutFulfilled = () => ({
    type: LOGOUT_FULFILLED
});

export const LOGOUT_REJECTED = 'LOGOUT_REJECTED';
const logoutRejected = () => ({
    type: LOGOUT_REJECTED
});

export const logout = () => {
    return dispatch => {
        dispatch(logoutPending())

        const onLogout = action => {
            dispatch(action());
            dispatch(resetProxy());
            dispatch(setScene('login'));
        };

        return ky.post(`${apiURL}/api/logout`, {credentials: 'include'})
            .then(_ => onLogout(logoutFulfilled))
            .catch(_ => onLogout(logoutRejected));
    };
};
