const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const parser = require('body-parser');
const dns = require('dns').promises;
const {setProxyEndpoint, getProxyEndpoint} = require('./database');
const {authenticate} = require('./auth');
const config = require('./config')().http;

const configApp = express();
configApp.disable('x-powered-by');
configApp.disable('etag');

// API
configApp.use('/api/', parser.json());
configApp.use('/api/', session({
    name: 'sessionId',
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000,
        ttl: 86400000 * 30
    })
}));
configApp.use('/api/', (_, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
configApp.get('/api/is-authenticated', async (request, response) => {
    if (request.session && request.session.username) {
        const clientAddress = '10.0.0.12'; //request.ip;
        const lookup = await dns.reverse(clientAddress);
        const clientHostname = lookup && lookup.length && lookup[0] || '';

        const {username, name} = request.session;
        console.log('Logged in as', username);
        response.send({username, name, clientAddress, clientHostname});
    } else {
        response.sendStatus(401);
    }
});
configApp.post('/api/authenticate', (request, response) => {
    const {username, password} = request.body;
    authenticate(username, password)
        .then(async user => {
            const clientAddress = '10.0.0.12'; //request.ip;
            const lookup = await dns.reverse(clientAddress);
            const clientHostname = lookup && lookup.length && lookup[0] || '';

            console.log('Successfully logged in as', username);
            request.session.username = user.username;
            request.session.name = user.name;
            request.session.save();
            response.send({
                username: user.username,
                name: user.name,
                clientAddress,
                clientHostname
            });
        })
        .catch(error => {
            console.log('Error authenticating', error);
            response.sendStatus(401);
        });
});
configApp.post('/api/logout', (request, response) => {
    if (request.session.username) {
        console.log('Logged out', request.session.username);
        request.session.destroy();
    }
    response.sendStatus(200);
});
configApp.post('/api/set-proxy-endpoint', (request, response) => {
    const username = request.session.username;
    if (username) {
        const {endpoint} = request.body;
        console.log('Setting proxy endpoint for', username, 'to', endpoint);
        setProxyEndpoint(username, endpoint);
        response.sendStatus(200);
    } else {
        response.sendStatus(401);
    }
});
configApp.get('/api/get-proxy-endpoint', (request, response) => {
    const username = request.session.username;
    if (username) {
        console.log('Getting proxy endpoint for', username);
        const endpoint = getProxyEndpoint(username);
        response.send({endpoint});
    } else {
        response.sendStatus(401);
    }
});

// Proxy
const proxyApp = express();
proxyApp.disable('x-powered-by');
proxyApp.disable('etag');
proxyApp.use(parser.raw({type: '*/*'}));
proxyApp.all('/:username/*', (request, response) => {
    const username = request.params.username;
    const proxyEndpoint = getProxyEndpoint(username);
    const path = request.params['0'];
    const method = request.method;
    const headers = getHeaders(request);
    const body = request.body;
    console.log(method, proxyEndpoint + '/' + path);
    console.log(headers);
    console.log(body);
    response.sendStatus(200);
});

// Start
configApp.listen(config.configPort, '0.0.0.0');
console.log('Config app listening on port', config.configPort);
proxyApp.listen(config.proxyPort, '0.0.0.0');
console.log('Proxy app listening on port', config.proxyPort);

// TODO: How to handle multiple headers with same name?
// One idea is to not parse it to a map. Instead, just add them individually to the outgoing request.
function getHeaders(request) {
    const rawHeaders = request.rawHeaders;
    var index = 0;
    var headers = {};
    while (index < rawHeaders.length) {
        const headerName = rawHeaders[index++];
        const headerValue = rawHeaders[index++];
        headers[headerName] = headerValue;
    }
    return headers;
}