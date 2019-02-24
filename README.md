# Callback service

Provides an HTTP service that is useful for developers working with third party services performing some kind of webhooks. You set up a local proxy, and make it publically available over the internet and you use that public address when communicating with the third party. Those public webhook calls will smoothly land on your local development environment.

[![Build status](https://travis-ci.org/anton-johansson/callback-service.svg?branch=master)](https://travis-ci.org/anton-johansson/callback-service)


## Running

```
$ LDAP_DOMAIN=... LDAP_URL=... LDAP_CA_PATH=... LDAP_SEARCH_BASE=... npm run dev
```


## Deploying

The service exposes two ports. One port (`8182`) for the actual proxy calls. This one needs to be exposed publically. The other port (`8181`) provides a UI for configuring proxy endpoints and should only be exposed on the local network.
