import ky from 'ky';

export const RECEIVE_AUTHENTICATION = 'RECEIVE_AUTHENTICATION';
const receiveAuthentication = (username) => ({
    type: RECEIVE_AUTHENTICATION,
    username
});

export const isAuthenticated = () => {
    return dispatch => {
        return ky.get('http://localhost:8181/api/is-authenticated')
            .then(response => {
                if (response.status === 200) {
                    const authentication = response.json();
                    console.log('Is authenticated as', authentication.username);
                    dispatch(receiveAuthentication(authentication.username))
                } else {
                    console.log('Is not authenticated');
                    dispatch(receiveAuthentication(''));
                }
            })
            .catch(err => {
                console.log('Error checking authentication:', err);
                dispatch(receiveAuthentication(''));
            })
    };
};

export const login = (username, password) => {
    return dispatch => {
        const options = {
            json: {
                username,
                password
            }
        };

        return ky.post('http://localhost:8181/api/authenticate', options)
            .then(response => {
                if (response.status === 200) {
                    console.log('Successfully authenticated as', username);
                    dispatch(receiveAuthentication(username));
                } else {
                    console.log('Bad credentials');
                    dispatch(receiveAuthentication(''));
                }
            })
            .catch(err => {
                console.log('Error authenticating:', err);
                dispatch(receiveAuthentication(''));
            });
    };
};

export const LOGOUT = 'LOGOUT';
export const logout = () => {
    return ({
        type: LOGOUT
    });
};