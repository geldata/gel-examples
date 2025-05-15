# GraphQL

Gel supports GraphQL queries via the built-in graphql extension. A full CRUD API for all object types, their properties (both material and computed), their links, and all aliases is reflected in the GraphQL schema.

## Setting up the extension

In order to set up GraphQL access to the database, add the following to the schema:

```sdl
using extension graphql;
```

Then create a new migration and apply it.

```bash
$ gel migration create
$ gel migrate
```

Refer to the connection docs for various methods of running these commands against remotely-hosted instances.

## Connection

Once you’ve activated the extension, your instance will listen for incoming GraphQL queries via HTTP at the following URL.

http://<instance-hostname><instance-port>/branch/<branch-name>/graphql

The default branch-name will be main, and after initializing your database, all queries are executed against it by default. If you want to query another branch instead, simply use that branch name in the URL.

To find the port number associated with a local instance, run gel instance list.

```bash
$ gel instance list
┌────────┬──────────────┬──────────┬───────────────┬─────────────┐
│ Kind   │ Name         │ Port     │ Version       │ Status      │
├────────┼──────────────┼──────────┼───────────────┼─────────────┤
│ local  │ inst1        │ 10700    │ 6.x           │ running     │
│ local  │ inst2        │ 10702    │ 6.x           │ running     │
│ local  │ inst3        │ 10703    │ 6.x           │ running     │
└────────┴──────────────┴──────────┴───────────────┴─────────────┘
```

To execute a GraphQL query against the main branch on the instance named inst2, we would send an HTTP request to http://localhost:10702/branch/gel/main.

To determine the URL of a Gel Cloud instance, find the host by running gel instance credentials -I <org-name>/<instance-name>. Use the host and port from that table in the URL format at the top of this section. Change the protocol to https since Gel Cloud instances are secured with TLS.

The endpoint also provides a GraphiQL interface to explore the GraphQL schema and write queries. Take the GraphQL query endpoint, append /explore, and visit that URL in the browser. Under the above example, the GraphiQL endpoint is available at http://localhost:10702/branch/main/graphql/explore.

## Authentication

Authentication for the GraphQL endpoint is identical to that for the EdgeQL HTTP endpoint.

## The protocol

Gel can recieve GraphQL queries via both GET and POST requests. Requests can contain the following fields:

The protocol implementations conform to the official GraphQL HTTP protocol. The protocol supports HTTP Keep-Alive.

## Known limitations

We provide this GraphQL extension to support users who are accustomed to writing queries in GraphQL. That said, GraphQL is quite limited and verbose relative to EdgeQL.

There are also some additional limitations:

