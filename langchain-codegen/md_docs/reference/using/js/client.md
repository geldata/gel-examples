# Client

The Client class implements the basic functionality required to establish a pool of connections to your database, execute queries with some context and parameters, manage transactions, and decode results into JavaScript types.

## Creating a client

The gel package exposes a createClient function that can be used to create a new Client instance. This client instance manages a pool of connections to the database which it discovers automatically from either being in a gel project init directory or being provided connection details via Environment Variables. See the environment section of the connection reference for more details and options.

If you’re using Gel Cloud to host your development instance, you can use the gel cloud login command to authenticate with Gel Cloud and then use the gel project init --server-instance <instance-name> command to create a local project-linked instance that is linked to an Gel Cloud instance. For more details, see the Gel Cloud guide.

```typescript
import { createClient } from "gel";

const client = createClient();

const answer = await client.queryRequiredSingle<number>("select 2 + 2;");
console.log(answer); // number: 4
```

## Running queries

The Client class provides a number of methods for running queries. The simplest is query, which runs a query and returns the result as an array of results. The function signature is generic over the type of the result element, so you can provide a type to receive a strongly typed result.

```typescript
import { createClient } from "gel";

const client = createClient();

const result = await client.query<number>("select 2 + 2;");
console.log(result); // number[]: [4]
```

## Configuring clients

Clients can be configured using a set of methods that start with with. One you’ll likely use often in application code is the withGlobals which sets the global variables in the query.

```typescript
const client = createClient();
await client
  .withGlobals({
    current_user_id: "00000000-0000-0000-0000-000000000000",
  })
  .querySingle(
    "select User { * } filter .id ?= global current_user_id;"
  );
```

These methods return a new Client instance that shares a connection pool with the original client. This is important. Each call to createClient instantiates a new connection pool, so in typical usage you should create a single shared client instance and configure it at runtime as needed.

## Client Reference

