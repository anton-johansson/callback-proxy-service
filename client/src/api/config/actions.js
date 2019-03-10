import ky from 'ky';

export const GET_CONFIG_PENDING = 'GET_CONFIG_PENDING';
const getConfigPending = () => ({
    type: GET_CONFIG_PENDING
});

export const GET_CONFIG_FULFILLED = 'GET_CONFIG_FULFILLED';
const getConfigFulfilled = config => ({
    type: GET_CONFIG_FULFILLED,
    proxyEndpoint: config.proxyEndpoint,
    suggestionPath: config.suggestionPath
});

export const GET_CONFIG_REJECTED = 'GET_CONFIG_REJECTED';
const getConfigRejected = errorMessage => ({
    type: GET_CONFIG_REJECTED,
    errorMessage
});

export const getConfig = () => {
    return dispatch => {
        dispatch(getConfigPending());

        return ky.get('http://localhost:8181/api/config', {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const data = await response.json();
                    dispatch(getConfigFulfilled(data));
                } else {
                    console.log('Unknown status when getting config:', response.status);
                    dispatch(getConfigRejected('Unknown status: ' + response.status));
                }
            }).catch(error => {
                console.log('Error getting target:', error);
                dispatch(getConfigRejected('Unknown error: ' + error));
            });
    };
}