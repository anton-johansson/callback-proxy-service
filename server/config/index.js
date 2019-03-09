const yaml = require('js-yaml');
const fs = require('fs');
const assign = require('object-assign-deep');

const configFilePath = process.env.CONFIG_FILE_PATH || '/etc/callback-proxy-service/callback-proxy-service.yaml';
const defaultConfig = {
    http: {
        configPort: 8181,
        proxyPort: 8182
    },
    ui: {
        suggestionPath: ':8080'
    },
    ldap: {
        attributes: {
            username: 'sAMAccountName',
            name: 'cn',
            email: 'mail'
        }
    },
    database: {
        fileName: '/var/callback-proxy-service/database.json'
    },
    log: {
        level: 'debug'
    }
};

let config = undefined;
module.exports = () => {
    if (config) {
        return config;
    }

    const userConfigData = fs.readFileSync(configFilePath);
    const userConfig = yaml.load(userConfigData);
    return config = assign(defaultConfig, userConfig);
};

