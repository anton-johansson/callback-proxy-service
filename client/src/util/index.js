export const getEndpointSuggestion = (clientAddress, clientHostname) => {
    const identifier = clientHostname ? clientHostname : clientAddress;
    return `http://${identifier}`;
};
