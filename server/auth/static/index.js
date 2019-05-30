const config = require('../../config')().auth.static;

module.exports = (username, password) => {
    return new Promise((resolve, reject) => {
        const user = config.users.find(user => username === user.username && password === user.password);
        if (user) {
            resolve({
                username: user.username,
                name: user.name,
                email: user.email
            });
        } else {
            reject(new Error('Could not find user'));
        }
    });
}