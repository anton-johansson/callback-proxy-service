const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const {setProxy, getProxyEndpoint} = require('./database');

const app = express();
app.disable('x-powered-by');
app.disable('etag');

// API
app.use('/api/', parser.json());
app.use('/api/', session({
    name: 'sessionId',
    secret: 'abc123',
    resave: false,
    saveUninitialized: false
}));
app.use('/api/', (_, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/api/is-authenticated', (request, response) => {
    if (request.session && request.session.username) {
        const {username, name} = request.session;
        console.log('Logged in as', username);
        response.send({username, name});
    } else {
        response.sendStatus(401);
    }
});
app.post('/api/authenticate', (request, response) => {
    const {username, password} = request.body;
    if (username === 'viantjoh' && password === 'test') {
        console.log('Successfully logged in as', username);
        request.session.username = 'viantjoh';
        request.session.name = 'Anton Johansson';
        request.session.save();
        response.send({
            username: 'viantjoh',
            name: 'Anton Johansson'
        });
    } else {
        response.sendStatus(401);
    }
});
app.post('/api/logout', (request, response) => {
    if (request.session.username) {
        console.log('Logged out', request.session.username);
        request.session.destroy();
    }
    response.sendStatus(200);
});
app.post('/api/set-proxy', (request, response) => {
    const {proxyEndpoint} = request.body;
    const username = request.session.username;
    if (username) {
        console.log('Setting proxy endpoint for', username, 'to', proxyEndpoint);
        setProxy(username, proxyEndpoint);
        response.sendStatus(200);
    } else {
        response.sendStatus(401);
    }
});

// Proxy
app.use('/x/', parser.raw({type: '*/*'}));
app.all('/x/:username/*', (request, response) => {
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
app.listen(8181);
console.log('Listening on port', 8181);

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