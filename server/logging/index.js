const Logger = require('node-json-logger');
const path = require('path');

const getLoggerName = callingModule => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

let level = 'debug';

module.exports.logging = callingModule => {
    const loggerName = getLoggerName(callingModule);
    return new Logger({level, loggerName});
};

module.exports.setLevel = newLevel => {
    level = newLevel;
}
