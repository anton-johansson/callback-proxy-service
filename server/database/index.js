var settings = {
    users: {
    }
};

const setProxy = (username, proxyEndpoint) => {
    console.log('setProxy', username, proxyEndpoint);
    settings.users[username] = {proxyEndpoint};
};

const getProxyEndpoint = (username) => {
    console.log(settings);
    return settings.users[username].proxyEndpoint;
}

module.exports = {setProxy, getProxyEndpoint};
