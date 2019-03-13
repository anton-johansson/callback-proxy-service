import ky from 'ky';
import {apiURL} from '../../util';

export const GET_CALLBACK_HISTORY_PENDING = 'GET_CALLBACK_HISTORY_PENDING';
const getCallbackHistoryPending = () => ({
    type: GET_CALLBACK_HISTORY_PENDING
});

export const GET_CALLBACK_HISTORY_FULFILLED = 'GET_CALLBACK_HISTORY_FULFILLED';
const getCallbackHistoryFulfilled = callbackHistory => ({
    type: GET_CALLBACK_HISTORY_FULFILLED,
    callbackHistory
});

export const GET_CALLBACK_HISTORY_REJECTED = 'GET_CALLBACK_HISTORY_REJECTED';
const getCallbackHistoryRejected = errorMessage => ({
    type: GET_CALLBACK_HISTORY_REJECTED,
    errorMessage
});

export const getCallbackHistory = () => {
    return dispatch => {
        dispatch(getCallbackHistoryPending());

        return ky.get(`${apiURL}/api/callback-history`, {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const data = await response.json();
                    dispatch(getCallbackHistoryFulfilled(data));
                } else {
                    console.log('Unknown status when getting callback history:', response.status);
                    dispatch(getCallbackHistoryRejected('Unknown status: ' + response.status));
                }
            }).catch(error => {
                console.log('Error getting callback history:', error);
                dispatch(getCallbackHistoryRejected('Unknown error: ' + error));
            });
    };
}

export const SET_SELECTED_CALLBACK_HISTORY_PENDING = 'SET_SELECTED_CALLBACK_HISTORY_PENDING';
const setSelectedCallbackHistoryPending = () => ({
    type: SET_SELECTED_CALLBACK_HISTORY_PENDING
});

export const SET_SELECTED_CALLBACK_HISTORY_FULFILLED = 'SET_SELECTED_CALLBACK_HISTORY_FULFILLED';
const setSelectedCallbackHistoryFulfilled = selectedCallbackHistoryIndex => ({
    type: SET_SELECTED_CALLBACK_HISTORY_FULFILLED,
    selectedCallbackHistoryIndex
});

export const setSelectedCallbackHistory = selectedCallbackHistoryIndex => {
    return dispatch => {
        dispatch(setSelectedCallbackHistoryPending());
        dispatch(setSelectedCallbackHistoryFulfilled(selectedCallbackHistoryIndex))
    };
}
