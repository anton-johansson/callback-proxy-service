const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const parser = require('body-parser');
const http = require('http');
const httpProxy = require('http-proxy');
const {setTarget, getTarget, saveCallbackHistory, getCallbackHistory} = require('./database');
const {authenticate} = require('./auth');
const config = require('./config')();
const {getUserAndPath, reverseDnsLookup, getRemoteAddress} = require('./util');
const log = require('./logging')(module);

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
if (process.env.REACT_APP_DEV_MODE) {
    log.warn('Running in development mode!');
    configApp.use('/api/', (_, response, next) => {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
}
configApp.get('/api/config', (request, response) => {
    if (request.session && request.session.username) {
        log.debug(`User ${request.session.username} requested config`);
        response.send({
            proxyEndpoint: config.http && config.http.proxyEndpoint,
            suggestionPath: config.ui && config.ui.suggestionPath
        });
    } else {
        response.sendStatus(401);
    }
});
configApp.get('/api/check-authenticated', async (request, response) => {
    if (request.session && request.session.username) {
        const clientAddress = getRemoteAddress(request);
        const lookup = await reverseDnsLookup(clientAddress);
        const clientHostname = lookup && lookup.length && lookup[0] || '';

        const {username, name} = request.session;
        log.info(`Is logged in as ${username}`);
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
configApp.post('/api/set-target', (request, response) => {
    const username = request.session.username;
    if (username) {
        const {target} = request.body;
        setTarget(username, target);
        response.sendStatus(200);
    } else {
        response.sendStatus(401);
    }
});
configApp.get('/api/get-target', (request, response) => {
    const username = request.session.username;
    if (username) {
        const target = getTarget(username);
        response.send({target});
    } else {
        response.sendStatus(401);
    }
});
configApp.get('/api/callback-history', (request, response) => {
    const username = request.session.username;
    if (username) {
        const callbackHistory = getCallbackHistory(username);
        response.send(callbackHistory);
    } else {
        response.sendStatus(401);
    }
})
configApp.use(express.static('client'));

// Proxy application
const proxy = httpProxy.createProxyServer({});
const proxyApp = http.createServer((request, response) => {
    const {username, path} = getUserAndPath(request.url);
    const target = getTarget(username);
    if (!target) {
        log.info(`Requested target for \'${username}\' but it's not configured`);
        response.writeHead(404);
        response.end();
        return;
    }

    const callbackData = {
        target,
        remoteAddress: getRemoteAddress(request),
        headers: request.headers,
        path,
        method: request.method
        //body: ???
    };
    saveCallbackHistory(username, callbackData);

    log.info(`Performing proxy request for ${username}`);
    request.url = path;
    proxy.web(request, response, {target}, error => {
        log.warn('Error occurred when proxying: ' + error, {data: {error}});
        response.writeHead(500);
        response.end();
    });
});

// Start
configApp.listen(config.http.configPort, '0.0.0.0');
log.info(`Config app listening on port ${config.http.configPort}`);
proxyApp.listen(config.http.proxyPort, '0.0.0.0');
log.info(`Proxy app listening on port ${config.http.proxyPort}`);
