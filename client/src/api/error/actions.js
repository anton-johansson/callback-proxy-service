export const ADD_ERROR_PENDING = 'ADD_ERROR_PENDING';
const addErrorPending = () => ({
    type: ADD_ERROR_PENDING
});

export const ADD_ERROR_FULFILLED = 'ADD_ERROR_FULFILLED';
const addErrorFulfilled = errorMessage => ({
    type: ADD_ERROR_FULFILLED,
    errorMessage
});

export const addError = errorMessage => {
    return dispatch => {
        dispatch(addErrorPending());
        dispatch(addErrorFulfilled(errorMessage));
    };
}

export const POP_ERROR_PENDING = 'POP_ERROR_PENDING';
const popErrorPending = () => ({
    type: POP_ERROR_PENDING
});

export const POP_ERROR_FULFILLED = 'POP_ERROR_FULFILLED';
const popErrorFulfilled = () => ({
    type: POP_ERROR_FULFILLED
});

export const popError = () => {
    return dispatch => {
        dispatch(popErrorPending());
        dispatch(popErrorFulfilled());
    };
}
