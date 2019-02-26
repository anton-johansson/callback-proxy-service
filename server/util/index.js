const dns = require('dns').promises;

module.exports.getUserAndPath = path => {
    path = path.substring(1);
    const index = path.indexOf('/');
    if (index > 0) {
        return {
            username: path.substring(0, index),
            path: path.substring(index)
        };
    }

    return {
        username: path,
        path: '/'
    };
};

module.exports.reverseDnsLookup = ip => {
    return dns.reverse(ip).catch(() => '');
};
