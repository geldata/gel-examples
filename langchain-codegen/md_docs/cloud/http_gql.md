# HTTP & GraphQL APIs

Using Gel Cloud via HTTP and GraphQL works the same as using any other |Gel| instance. The two differences are in how to discover your instance’s URL and authentication.

## Enabling

Gel Cloud can expose an HTTP endpoint for EdgeQL queries. Since HTTP is a stateless protocol, no DDL or transaction commands, can be executed using this endpoint.  Only one query per request can be executed.

In order to set up HTTP access to the database add the following to the schema:

```sdl
using extension edgeql_http;
```

Then create a new migration and apply it using gel migration create and gel migrate, respectively.

Your instance can now receive EdgeQL queries over HTTP at https://<host>:<port>/branch/<branch-name>/edgeql.

## Instance URL

To determine the URL of a Gel Cloud instance, find the host by running gel instance credentials -I <org-name>/<instance-name>. Use the host and port from that table in the URL format above this note. Change the protocol to https since Gel Cloud instances are secured with TLS.

Your instance can now receive EdgeQL queries over HTTP at https://<hostname>:<port>/branch/<branch-name>/edgeql.

## Authentication

To authenticate to your Gel Cloud instance, first create a secret key using the Gel Cloud UI or gel cloud secretkey create. Use the secret key as your token with the bearer authentication method. Here is an example showing how you might send the query select Person {*}; using cURL:

```bash
$ curl -G https://<cloud-instance-host>:<cloud-instance-port>/branch/main/edgeql \
   -H "Authorization: Bearer <secret-key> \
   --data-urlencode "query=select Person {*};"
```

## Usage

Usage of the HTTP and GraphQL APIs is identical on a Gel Cloud instance. Reference the HTTP and GraphQL documentation for more information.

