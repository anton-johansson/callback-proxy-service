const config = require('../config')().auth;

const authenticate = (() => {
    if (config.ldap && config.ldap.enabled) {
        return require('./ldap');
    }
    if (config.static && config.static.enabled) {
        return require('./static');
    }
})();

module.exports = {authenticate};
