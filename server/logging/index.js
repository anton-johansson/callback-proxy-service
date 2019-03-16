const Logger = require('node-json-logger');
const path = require('path');
const config = require('../config')().log;

const getLoggerName = callingModule => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

module.exports = callingModule => {
    const loggerName = getLoggerName(callingModule);
    const logger = new Logger({level: config.level, loggerName});
    logger.head = level => {
        const data = {};
        if (logger.options.timestamp) {
            data.timestamp = logger.timestamp();
        }
        data.level = level.toUpperCase();
        if (logger.options.loggerName) {
            data.loggerName = logger.options.loggerName;
        }
        return data;
    }
    return logger;
};
