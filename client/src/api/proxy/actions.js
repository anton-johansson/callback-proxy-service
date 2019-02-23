import ky from 'ky';

export const PROXY_RESET = 'PROXY_RESET';
export const reset = () => ({
    type: PROXY_RESET
});

export const GET_PROXY_ENDPOINT_PENDING = 'GET_PROXY_ENDPOINT_PENDING';
const getProxyEndpointPending = () => ({
    type: GET_PROXY_ENDPOINT_PENDING
});

export const GET_PROXY_ENDPOINT_FULFILLED = 'GET_PROXY_ENDPOINT_FULFILLED';
const getProxyEndpointFulfilled = (endpoint) => ({
    type: GET_PROXY_ENDPOINT_FULFILLED,
    endpoint
});

export const GET_PROXY_ENDPOINT_REJECTED = 'GET_PROXY_ENDPOINT_REJECTED';
const getProxyEndpointRejected = (errorMessage) => ({
    type: GET_PROXY_ENDPOINT_REJECTED,
    errorMessage
});

export const getProxyEndpoint = () => {
    return dispatch => {
        dispatch(getProxyEndpointPending());

        return ky.get('http://localhost:8181/api/get-proxy-endpoint', {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const data = await response.json();
                    dispatch(getProxyEndpointFulfilled(data.endpoint));
                } else {
                    console.log('Unknown status when setting proxy endpoint:', response.status);
                    dispatch(getProxyEndpointRejected('Unknown status: ' + response.status));
                }
            }).catch(err => {
                console.log('Error getting proxy endpoint:', err);
                dispatch(getProxyEndpointRejected('Unknown error: ' + err));
            });
    };
}

export const SET_PROXY_ENDPOINT_PENDING = 'SET_PROXY_ENDPOINT_PENDING';
const setProxyEndpointPending = (endpoint) => ({
    type: SET_PROXY_ENDPOINT_PENDING,
    endpoint
});

export const SET_PROXY_ENDPOINT_FULFILLED = 'SET_PROXY_ENDPOINT_FULFILLED';
const setProxyEndpointFulfilled = (endpoint) => ({
    type: SET_PROXY_ENDPOINT_FULFILLED,
    endpoint
});

export const SET_PROXY_ENDPOINT_REJECTED = 'SET_PROXY_ENDPOINT_REJECTED';
const setProxyEndpointRejected = (errorMessage) => ({
    type: SET_PROXY_ENDPOINT_REJECTED,
    errorMessage
});

export const setProxyEndpoint = (endpoint) => {
    return dispatch => {
        dispatch(setProxyEndpointPending(endpoint));

        const options = {
            credentials: 'include',
            json: {
                endpoint
            }
        };

        return ky.post('http://localhost:8181/api/set-proxy-endpoint', options)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setProxyEndpointFulfilled(endpoint));
                } else {
                    console.log('Unknown status when setting proxy endpoint:', response.status);
                    dispatch(setProxyEndpointRejected('Unknown status: ' + response.status));
                }
            })
            .catch(err => {
                console.log('Error setting proxy endpoint:', err);
                dispatch(setProxyEndpointRejected('Unknown error: ' + err));
            });
    };
};