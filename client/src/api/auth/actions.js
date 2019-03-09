import ky from 'ky';

export const RECEIVE_AUTHENTICATION = 'RECEIVE_AUTHENTICATION';
const receiveAuthentication = (authentication) => ({
    type: RECEIVE_AUTHENTICATION,
    authentication
});

export const checkAuthentication = () => {
    return dispatch => {
        return ky.get('http://localhost:8181/api/check-authenticated', {credentials: 'include'})
            .then(async response => {
                if (response.status === 200) {
                    const authentication = await response.json();
                    console.log('Is authenticated as', authentication.username);
                    dispatch(receiveAuthentication(authentication))
                } else {
                    console.log('Is not authenticated');
                    dispatch(receiveAuthentication());
                }
            })
            .catch(err => {
                console.log('Error checking authentication:', err);
                dispatch(receiveAuthentication());
            })
    };
};

export const login = (username, password) => {
    return dispatch => {
        const options = {
            credentials: 'include',
            json: {
                username,
                password
            }
        };

        return ky.post('http://localhost:8181/api/authenticate', options)
            .then(async response => {
                if (response.status === 200) {
                    console.log('Successfully logged in, checking credentials');
                    dispatch(checkAuthentication());
                } else {
                    console.log('Bad credentials');
                    dispatch(receiveAuthentication());
                }
            })
            .catch(err => {
                console.log('Error authenticating:', err);
                dispatch(receiveAuthentication());
            });
    };
};

export const logout = () => {
    return dispatch => {
        return ky.post('http://localhost:8181/api/logout', {credentials: 'include'})
            .then(_ => dispatch(receiveAuthentication()));
    };
};
