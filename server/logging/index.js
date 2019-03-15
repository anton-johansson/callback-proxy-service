const Logger = require('node-json-logger');
const path = require('path');
const config = require('../config')().log;

const getLoggerName = callingModule => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

module.exports = callingModule => {
    const loggerName = getLoggerName(callingModule);
    return new Logger({level: config.level, loggerName});
};
