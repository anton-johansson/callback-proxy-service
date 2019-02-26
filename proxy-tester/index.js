const express = require('express');
const parser = require('body-parser');

const app = express();
app.use(parser.raw({type: '*/*'}));
app.use((request, response, next) => {
    console.log('Receiving proxy request');

    const path = request.path;
    const method = request.method;
    const body = request.body.toString('UTF-8');

    console.log('Proxy request:');
    console.log(method, path);
    console.log(body);

    response.writeHead(201, {
        'X-Method': method,
        'X-Path': path
    });

    response.write('Method: ' + method + '\n');
    response.write('Path: ' + path + '\n');
    response.write('Body:\n');
    response.write(body);
    response.end();
    next();
});

app.listen(3333, '0.0.0.0');
console.log('Listening on port 3333');
