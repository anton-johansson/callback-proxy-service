const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const config = require('../config')().database;
const log = require('../logging')(module);

const adapter = new FileSync(config.fileName);
const database = low(adapter);
database.defaults({users: {}}).write();

const saveTargetHistory = (username, target) => {
    const targetData = {
        timestamp: new Date().toISOString(),
        target
    }
    const key = `users.${username}.targetHistory`;
    let history = database.get(key).value();
    if (!history || !Array.isArray(history)) {
        log.debug(`No target history found for ${username}, setting a new history`);
        database.set(key, [targetData]).write();
    } else {
        if (history.length >= config.targetHistorySize) {
            log.debug(`Target history for ${username} is larger than ${config.targetHistorySize}, popping one`);
            history.pop();
        }
        log.debug(`Adding target history for ${username}`);
        history.unshift(targetData);
        database.set(key, history).write();
    }
}

const setTarget = (username, target) => {
    log.info(`Setting target to '${target}' for ${username}`);
    const key = `users.${username}.target`;
    database.set(key, target).write();
    saveTargetHistory(username, target);
}

const getTarget = (username) => {
    log.info(`Getting target for ${username}`);
    const key = `users.${username}.target`;
    return database.get(key).value();
}

const saveCallbackHistory = (username, callbackData) => {
    callbackData.timestamp = new Date().toISOString();
    const key = `users.${username}.callbackHistory`;
    let history = database.get(key).value();
    if (!history || !Array.isArray(history)) {
        log.debug(`No callback history found for ${username}, setting a new history`);
        database.set(key, [callbackData]).write();
    } else {
        if (history.length >= config.callbackHistorySize) {
            log.debug(`Callback history for ${username} is larger than ${config.callbackHistorySize}, popping one`);
            history.pop();
        }
        log.debug(`Adding callback history for ${username}`);
        history.unshift(callbackData);
        database.set(key, history).write();
    }
}

const getCallbackHistory = username => {
    log.info(`Getting callback history for ${username}`);
    const key = `users.${username}.callbackHistory`;
    return database.get(key).value();
};

module.exports = {setTarget, getTarget, saveCallbackHistory, getCallbackHistory};
