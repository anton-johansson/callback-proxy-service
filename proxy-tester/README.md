# Proxy tester

A dummy service that basically returns whatever is given to it. Very useful for testing the proxy.


## Running

```
$ npm install
$ node index.js
```


## Usage

Start `callback-proxy-service`, login and set proxy target to `http://localhost:3333`. You should be able to access `http://localhost:8182/<username>/whatever`, and get proxied results.
