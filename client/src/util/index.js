export const getTargetSuggestion = (clientAddress, clientHostname) => {
    const identifier = clientHostname ? clientHostname : clientAddress;
    return `http://${identifier}`;
};
