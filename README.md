# Callback service

Provides an HTTP service that is useful for developers working with third party services performing some kind of webhooks. You set up a local proxy, and make it publically available over the internet and you use that public address when communicating with the third party. Those public webhook calls will smoothly land on your local development environment.

[![Build status](https://travis-ci.org/anton-johansson/callback-service.svg?branch=master)](https://travis-ci.org/anton-johansson/callback-service)
![Version](https://img.shields.io/github/package-json/v/anton-johansson/callback-service.svg)


## Running

```
$ npm run dev
```

## Configuration

The service is configured using a YAML file, located at `/etc/callback-service/callback-service.yaml` (but can be overridden with the environment variable `CONFIG_FILE_PATH`). Here's an example configuration file:

```yaml
http:
  configPort: 8181
  proxyPort: 8182
  session:
    secret: ...
ui:
  suggestionPath: :8080
database:
  fileName: /var/callback-service/callback-service.json
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
