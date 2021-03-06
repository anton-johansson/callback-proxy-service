const ldap = require('ldapjs');
const config = require('../../config')().auth.ldap;
const log = require('../../logging')(module);

/*
let ca = undefined;
const readCA = () => {
    if (ca) {
        return ca;
    }
    return ca = readFileSync(caPath, 'UTF-8');
}
*/

const createClient = () => {
//    const ca = readCA();
    return ldap.createClient({
        url: config.url,
        connectTimeout: 5000,
        timeout: 5000,
        tlsOptions: {
            rejectUnauthorized: false, // TODO: should be fixed, when CA actually works
//            ca: [ca]
        }
    });
};

module.exports = (username, password) => {
    return new Promise((resolve, reject) => {
        const client = createClient();
        const close = client => {
            client.unbind();
            client.destroy();
        };

        if (!username) {
            reject('Username is mandatory');
            return;
        }

        log.debug(`Searching for user ${username}`);
        client.bind(`${username}@${config.domain}`, password, function(error) {
            if (error) {
                log.debug(`Error occurred when binding: ${error}`);
                close(client);
                reject(error);
                return;
            }

            const options = {
                filter: `(${config.attributes.username}=${username})`,
                scope: "sub",
                attributes: [config.attributes.username, config.attributes.name, config.attributes.email]
            };
            client.search(config.searchBase, options, (error, response) => {
                if (error) {
                log.debug(`Error occurred when searching: ${error}`);
                    log.error('Error occurred when searching LDAP', error);
                    reject(error);
                }

                let user = undefined;
                response.on('searchEntry', entry => {
                    user = {
                        username: entry.object[config.attributes.username],
                        name: entry.object[config.attributes.name],
                        email: entry.object[config.attributes.email]
                    }
                });
                response.on('error', error => {
                    close(client);
                    reject(error);
                });
                response.on('end', () => {
                    close(client);
                    if (user) {
                        resolve(user);
                    } else {
                        reject(new Error('Could not find user'));
                    }
                });
            });
        });
    });
}
