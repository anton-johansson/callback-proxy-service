const dns = require('dns').promises;

module.exports.reverseDnsLookup = (ip) => {
    return dns.reverse(ip).catch(() => '');
};
