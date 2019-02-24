const ldap = require('ldapjs');
const {readFileSync} = require('fs');

const domain = process.env.LDAP_DOMAIN;
const url = process.env.LDAP_URL;
const caPath = process.env.LDAP_CA_PATH;
const searchBase = process.env.LDAP_SEARCH_BASE;

let ca = undefined;
const readCA = () => {
    if (ca) {
        return ca;
    }
    return ca = readFileSync(caPath, 'UTF-8');
}

const createClient = () => {
    const ca = readCA();
    return ldap.createClient({
        url,
        connectTimeout: 5000,
        timeout: 5000,
        tlsOptions: {
            rejectUnauthorized: false, // TODO: should be fixed, when CA actually works
            ca: [ca]
        }
    });
};

const authenticate = (username, password) => {
    return new Promise((resolve, reject) => {
        const client = createClient();
        const close = client => {
            client.unbind();
            client.destroy();
        };

        client.bind(`${username}@${domain}`, password, function(error) {
            if (error) {
                close(client);
                reject(new Error('Bad credentials'));
                return;
            }
            
            const options = {
                filter: `(sAMAccountName=${username})`,
                scope: "sub",
                attributes: ['cn', 'sAMAccountName', 'mail']
            };
            client.search(searchBase, options, (error, response) => {
                let user = undefined;
                response.on('searchEntry', entry => {
                    user = {
                        username: entry.object.sAMAccountName,
                        name: entry.object.cn,
                        email: entry.object.mail
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

module.exports = {authenticate};
