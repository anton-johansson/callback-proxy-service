const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const config = require('../config')().database;

const adapter = new FileSync(config.fileName);
const database = low(adapter);
database.defaults({users: {}}).write();

const setProxyEndpoint = (username, proxyEndpoint) => {
    const key = `users.${username}.proxyEndpoint`;
    database.set(key, proxyEndpoint).write();
};

const getProxyEndpoint = (username) => {
    const key = `users.${username}.proxyEndpoint`;
    return database.get(key).value();
}

module.exports = {setProxyEndpoint, getProxyEndpoint};
