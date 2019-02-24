const yaml = require('js-yaml');
const fs = require('fs');
const assign = require('object-assign-deep');

const configFilePath = process.env.CONFIG_FILE_PATH || '/etc/callback-service/callback-service.yaml';
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
        fileName: '/var/callback-service/database.json'
    }
};

let config = undefined;
module.exports = () => {
    if (config) {
        console.log('Using cached config');
        return config;
    }

    console.log('Building config');
    const userConfigData = fs.readFileSync(configFilePath);
    const userConfig = yaml.load(userConfigData);
    return config = assign(defaultConfig, userConfig);
};

