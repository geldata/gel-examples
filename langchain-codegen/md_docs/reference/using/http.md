# EdgeQL over HTTP

Gel can expose an HTTP endpoint for EdgeQL queries. Since HTTP is a stateless protocol, no DDL, transaction commands, can be executed using this endpoint.  Only one query per request can be executed.

## Setup

In order to set up HTTP access to the database add the following to the schema:

```sdl
using extension edgeql_http;
```

Then create a new migration and apply it using gel migration create and gel migrate, respectively.

Your instance can now receive EdgeQL queries over HTTP at https://<hostname>:<port>/branch/<branch-name>/edgeql.

Here’s how to determine your local Gel instance’s HTTP server URL: The hostname will be localhost Find the port by running gel instance list. This will print a table of all Gel instances on your machine, including their associated port number. The default branch-name will be main, and after initializing your database, all queries are executed against it by default. If you want to query another branch instead, simply use that branch name in the URL. To determine the URL of a Gel Cloud instance, find the host by running gel instance credentials -I <org-name>/<instance-name>. Use the host and port from that table in the URL format above this note.  Change the protocol to https since Gel Cloud instances are secured with TLS. To determine the URL of a self-hosted remote instance you have linked with the CLI, you can get both the hostname and port of the instance from the “Port” column of the gel instance list table (formatted as <hostname>:<port>). The same guidance on local branch names applies here.

## Authentication

By default, the HTTP endpoint uses cfg::Password based authentication, in which HTTP Basic Authentication is used to provide a Gel username and password.

This is configurable, however: the HTTP endpoint’s authentication mechanism can be configured by adjusting which cfg::AuthMethod applies to the SIMPLE_HTTP cfg::ConnectionTransport.

If cfg::JWT is used, the requests should contain these headers:

If cfg::Trust is used, no authentication is done at all. This is not generally recommended, but can be used to recover the pre-4.0 behavior:

```default
db> configure instance insert cfg::Auth {
...     priority := -1,
...     method := (insert cfg::Trust { transports := "SIMPLE_HTTP" }),
... };
OK: CONFIGURE INSTANCE
```

To authenticate to your Gel Cloud instance, first create a secret key using the Gel Cloud UI or gel cloud secretkey create. Use the secret key as your token with the bearer authentication method. Here is an example showing how you might send the query select Person {*}; using cURL:

```bash
$ curl -G https://<cloud-instance-host>:<cloud-instance-port>/branch/main/edgeql \
   -H "Authorization: Bearer <secret-key> \
   --data-urlencode "query=select Person {*};"
```

## Querying

Gel supports GET and POST methods for handling EdgeQL over HTTP protocol. Both GET and POST methods use the following fields:

The protocol supports HTTP Keep-Alive.

