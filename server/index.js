const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const parser = require('body-parser');
const http = require('http');
const httpProxy = require('http-proxy');
const {URL} = require('url');
const {setProxyEndpoint, getProxyEndpoint, saveCallbackHistory} = require('./database');
const {authenticate} = require('./auth');
const config = require('./config')();
const {getUserAndPath, reverseDnsLookup, getRemoteAddress} = require('./util');
const {logging, setLevel} = require('./logging');

// Set up logging
setLevel(config.log.level);
const log = logging(module);

// Config application
const configApp = express();
configApp.disable('x-powered-by');
configApp.disable('etag');
configApp.use('/api/', parser.json());
configApp.use('/api/', session({
    name: 'sessionId',
    secret: config.http.session.secret,
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
configApp.get('/api/check-authenticated', async (request, response) => {
    if (request.session && request.session.username) {
        const clientAddress = '10.0.0.12'; //request.ip;
        const lookup = await reverseDnsLookup(clientAddress);
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
        .then(user => {
            log.info(`Successfully logged in as ${user.username}`);
            request.session.username = user.username;
            request.session.name = user.name;
            request.session.save();
            response.sendStatus(200);
        })
        .catch(error => {
            log.info(`Error authenticating: ${error}`);
            response.sendStatus(401);
        });
});
configApp.post('/api/logout', (request, response) => {
    if (request.session.username) {
        log.info(`Logged out ${request.session.username}`);
        request.session.destroy();
    }
    response.sendStatus(200);
});
configApp.post('/api/set-proxy-endpoint', (request, response) => {
    const username = request.session.username;
    if (username) {
        const {endpoint} = request.body;
        log.info(`Setting proxy endpoint for ${username} to ${endpoint}`);
        setProxyEndpoint(username, endpoint);
        response.sendStatus(200);
    } else {
        response.sendStatus(401);
    }
});
configApp.get('/api/get-proxy-endpoint', (request, response) => {
    const username = request.session.username;
    if (username) {
        log.info(`Getting proxy endpoint for ${username}`);
        const endpoint = getProxyEndpoint(username);
        response.send({endpoint});
    } else {
        response.sendStatus(401);
    }
});
configApp.use(express.static('client'));

// Proxy application
const proxy = httpProxy.createProxyServer({});
const proxyApp = http.createServer((request, response) => {
    const {username, path} = getUserAndPath(request.url);
    const target = getProxyEndpoint(username);
    if (!target) {
        log.info(`Requested proxy for \'${username}\' but it's not configured`);
        response.writeHead(404);
        response.end();
        return;
    }

    const callbackData = {
        remoteAddress: getRemoteAddress(request),
        headers: request.headers,
        path: request.url,
        method: request.method
        //body: ???
    };
    saveCallbackHistory(username, callbackData);

    log.info(`Performing proxy request for ${username}`);
    request.url = path;
    proxy.web(request, response, {target});
});

// Start
configApp.listen(config.http.configPort, '0.0.0.0');
log.info(`Config app listening on port ${config.http.configPort}`);
proxyApp.listen(config.http.proxyPort, '0.0.0.0');
log.info(`Proxy app listening on port ${config.http.proxyPort}`);
