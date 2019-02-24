# Callback service

Provides an HTTP service that is useful for developers working with third party services performing some kind of webhooks. You set up a local proxy, and make it publically available over the internet and you use that public address when communicating with the third party. Those public webhook calls will smoothly land on your local development environment.


## Running

```
$ LDAP_DOMAIN=... LDAP_URL=... LDAP_CA_PATH=... LDAP_SEARCH_BASE=... npm run dev
```
