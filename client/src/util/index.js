export const getTargetSuggestion = (clientAddress, clientHostname, suggestionPath) => {
    const identifier = clientHostname ? clientHostname : clientAddress;
    return `http://${identifier}${suggestionPath ? suggestionPath : ''}`;
};

export const apiURL = process.env.REACT_APP_DEV_MODE ? 'http://localhost:8181' : '';
