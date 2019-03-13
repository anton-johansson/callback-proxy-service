import ky from 'ky';
import {apiURL} from '../../util';

export const PROXY_RESET = 'PROXY_RESET';
export const reset = () => ({
    type: PROXY_RESET
});

export const GET_TARGET_PENDING = 'GET_TARGET_PENDING';
const getTargetPending = () => ({
    type: GET_TARGET_PENDING
});

export const GET_TARGET_FULFILLED = 'GET_TARGET_FULFILLED';
const getTargetFulfilled = (target) => ({
    type: GET_TARGET_FULFILLED,
    target
});

export const GET_TARGET_REJECTED = 'GET_TARGET_REJECTED';
const getTargetRejected = (errorMessage) => ({
    type: GET_TARGET_REJECTED,
    errorMessage
});

export const getTarget = () => {
    return dispatch => {
        dispatch(getTargetPending());

        return ky.get(`${apiURL}/api/get-target`, {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const data = await response.json();
                    dispatch(getTargetFulfilled(data.target));
                } else {
                    console.log('Unknown status when setting target:', response.status);
                    dispatch(getTargetRejected('Unknown status: ' + response.status));
                }
            }).catch(error => {
                console.log('Error getting target:', error);
                dispatch(getTargetRejected('Unknown error: ' + error));
            });
    };
}

export const SET_TARGET_PENDING = 'SET_TARGET_PENDING';
const setTargetPending = (target) => ({
    type: SET_TARGET_PENDING,
    target
});

export const SET_TARGET_FULFILLED = 'SET_TARGET_FULFILLED';
const setTargetFulfilled = (target) => ({
    type: SET_TARGET_FULFILLED,
    target
});

export const SET_TARGET_REJECTED = 'SET_TARGET_REJECTED';
const setTargetRejected = (errorMessage) => ({
    type: SET_TARGET_REJECTED,
    errorMessage
});

export const setTarget = (target) => {
    return dispatch => {
        dispatch(setTargetPending(target));

        const options = {
            credentials: 'include',
            json: {
                target
            }
        };

        return ky.post(`${apiURL}/api/set-target`, options)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setTargetFulfilled(target));
                } else {
                    console.log('Unknown status when setting target:', response.status);
                    dispatch(setTargetRejected('Unknown status: ' + response.status));
                }
            })
            .catch(error => {
                console.log('Error setting target:', error);
                dispatch(setTargetRejected('Unknown error: ' + error));
            });
    };
};
