# TypeScript

## Installation

Install the client and optional (but recommended!) generator packages from npm using your package manager of choice.

### npm

```bash
$ npm install --save-prod gel          # database client
$ npm install --save-dev @gel/generate # generators
```

### yarn

```bash
$ yarn add gel                 # database client
$ yarn add --dev @gel/generate # generators
```

### pnpm

```bash
$ pnpm add --save-prod gel          # database client
$ pnpm add --save-dev @gel/generate # generators
```

### bun

```bash
$ bun add gel                 # database client
$ bun add --dev @gel/generate # generators
```

### deno

```bash
$ deno add npm:gel                 # database client
$ deno add --dev npm:@gel/generate # generators
```

## Basic Usage

The gel package exposes a createClient function that can be used to create a new Client instance. This client instance manages a pool of connections to the database which it discovers automatically from either being in a gel project init directory or being provided connection details via Environment Variables. See the environment section of the connection reference for more details and options.

If you’re using Gel Cloud to host your development instance, you can use the gel cloud login command to authenticate with Gel Cloud and then use the gel project init --server-instance <instance-name> command to create a local project-linked instance that is linked to an Gel Cloud instance. For more details, see the Gel Cloud guide.

Once you have a client instance, you can use the various query methods to execute queries. Each of these methods has an implied cardinality of the result, and if you’re using TypeScript, you can provide a type parameter to receive a strongly typed result.

```bash
$ mkdir gel-js-example
$ cd gel-js-example
$ npm init -y
$ npm install gel
$ npm install --save-dev @gel/generate
$ npx gel project init --non-interactive
$ touch index.mjs
```

*index.mjs*

```javascript
import { createClient } from "gel";
import assert from "node:assert";

const client = createClient(); // get connection details automatically

// Query always returns an array of result, even for single object queries
const queryResult = await client.query("select 1");
assert.equal(queryResult, [1]);

// querySingle will throw an error if the query returns more than one row
const singleQueryResult = await client.querySingle("select 1");
assert.equal(singleQueryResult, 1);

// queryRequired will throw an error if the query returns no rows
const requiredQueryResult = await client.queryRequired("select 1");
assert.equal(requiredQueryResult, 1);

// queryRequiredSingle will throw an error if
// - the query returns more than one row
// - the query returns no rows
const requiredSingleQueryResult = await client.queryRequiredSingle("select 1");
assert.equal(requiredSingleQueryResult, 1);
```

## Code generation

The @gel/generate npm package provides a set of generators that can make querying the database a bit more pleasant than manually constructing strings and passing explicit query element types to the query methods.

## Next steps

If you haven’t already done so, you can go through our quickstart tutorial to have a guided tour of using Gel as the data layer for a complex web application.

You will also find full reference information in this section of the documentation for the various generators and public APIs that the gel and @gel/generate packages provide.

