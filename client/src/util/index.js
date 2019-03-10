export const getTargetSuggestion = (clientAddress, clientHostname, suggestionPath) => {
    const identifier = clientHostname ? clientHostname : clientAddress;
    return `http://${identifier}${suggestionPath ? suggestionPath : ''}`;
};
