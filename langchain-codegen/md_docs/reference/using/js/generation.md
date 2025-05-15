# Code Generation

The @gel/generate package provides a set of code generation tools that are useful when developing a Gel-backed applications with TypeScript/JavaScript.

## Setup

To install the @gel/generate package, run the following command.

### npm

```bash
$ npm install --save-dev @gel/generate
```

### yarn

```bash
$ yarn add --dev @gel/generate
```

### pnpm

```bash
$ pnpm add --save-dev @gel/generate
```

### bun

```bash
$ bun add --dev @gel/generate
```

### deno

```bash
$ deno add --dev npm:@gel/generate
```

Since the generators work by connecting to the database to introspect your schema and analyze queries, you’ll need to have a database connection available when running the generators and to rerun generators any time the schema changes.

Like the CLI, the generators use the connection details from your initialized project, environment, or connection flags to connect to the database. See the connection parameters reference for more details.

You can ensure that the generators are always up-to-date locally by adding them to your gel.toml’s schema.update.after hook as in this example:

*gel.toml*

```toml
[instance]
server-version = "6.4"

[hooks]
schema.update.after = "npx @gel/generate queries --file"
```

## Basic usage

Run a generator with the following command.

### npm

```bash
$ npx @gel/generate <generator> [options]
```

### yarn

```bash
$ yarn run -B generate <generator> [options]
```

### pnpm

```bash
$ pnpm exec generate <generator> [options]
```

### Deno

```bash
$ deno run \
  --allow-all \
  npm:@gel/generate <generator> [options]
```

### bun

```bash
$ bunx @gel/generate <generator> [options]
```

The value of <generator> should be one of the following:

| --- | --- | --- |
| edgeql-js | Generates the query builder which provides a code-first way to write fully-typed EdgeQL queries with TypeScript. We recommend it for TypeScript users, or anyone who prefers writing queries with code. | docs |
| queries | Scans your project for *.edgeql files and generates functions that allow you to execute these queries in a typesafe way. | docs |
| interfaces | Introspects your schema and generates file containing TypeScript interfaces that correspond to each object type. This is useful for writing typesafe code to interact with Gel. | docs |

