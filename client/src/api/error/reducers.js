import {
    ADD_ERROR_FULFILLED,
    POP_ERROR_FULFILLED
} from './actions';

const error = (
    state = {
        errorMessages: []
    },
    action
) => {
    switch (action.type) {
        case ADD_ERROR_FULFILLED:
            const errorMessages = state.errorMessages.slice();
            errorMessages.push(action.errorMessage);
            return {
                ...state,
                errorMessages
            };
        case POP_ERROR_FULFILLED:
            const errorMessagesAfterPop = state.errorMessages.slice();
            errorMessagesAfterPop.pop();
            return {
                ...state,
                errorMessages: errorMessagesAfterPop
            };
        default:
            return state;
    }
}

export default error;
