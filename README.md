# Callback proxy service

Provides an HTTP service that is useful for developers working with third party services performing some kind of webhooks. You set up a local proxy, and make it publically available over the internet and you use that public address when communicating with the third party. Those public webhook calls will smoothly land on your local development environment.

[![Build status](https://travis-ci.org/anton-johansson/callback-proxy-service.svg?branch=master)](https://travis-ci.org/anton-johansson/callback-proxy-service)
[![Version](https://img.shields.io/github/package-json/v/anton-johansson/callback-proxy-service.svg)](https://github.com/anton-johansson/callback-proxy-service/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/antonjohansson/callback-proxy-service.svg)](https://hub.docker.com/r/antonjohansson/callback-proxy-service)
[![MicroBadger Layers](https://img.shields.io/microbadger/layers/antonjohansson/callback-proxy-service.svg)(https://hub.docker.com/r/antonjohansson/callback-proxy-service)
[![MicroBadger Size](https://img.shields.io/microbadger/image-size/antonjohansson/callback-proxy-service.svg)(https://hub.docker.com/r/antonjohansson/callback-proxy-service)


## Running

Build and install necessary dependencies:

```shell
$ npm run build
```

Start the application in development mode:

```
$ npm run dev
```

This starts three processes that is watching for changes:

* `server`: Starts a HTTP server, serving the server application on port 8181, re-starting automatically if server-files are changed.
* `client / start`: Starts the client application on port 3000, re-loading the page automatically if client-files are changed.
* `client / watch-css`: Watches for changes to `*.scss` files and compiles them to `*.css`.

In production mode, the server and client would be served on the same port, but in development mode we use different ones in order to get auto-reloads working properly.


## Configuration

The service is configured using a YAML file, located at `/etc/callback-proxy-service/callback-proxy-service.yaml` (but can be overridden with the environment variable `CONFIG_FILE_PATH`). Here's an example configuration file:

```yaml
http:
  configPort: 8181
  proxyPort: 8182
  session:
    secret: ...
ui:
  suggestionPath: :8080
database:
  fileName: /var/callback-proxy-service/callback-proxy-service.json
ldap:
  domain: ...
  url: ...
  searchBase: ...
  attributes:
    username: sAMAccountName
    name: cn
    email: mail
```


## Deploying

The service exposes two ports. One port (`8182`) for the actual proxy calls. This one needs to be exposed publically. The other port (`8181`) provides a UI for configuring proxy endpoints and should only be exposed on the local network.
