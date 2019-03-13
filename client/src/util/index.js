export const getTargetSuggestion = (clientAddress, clientHostname, suggestionPath) => {
    const identifier = clientHostname ? clientHostname : clientAddress;
    return `http://${identifier}${suggestionPath ? suggestionPath : ''}`;
};

export const apiURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8181' : '';
