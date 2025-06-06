This is a sample project demonstrating how to use [EdgeDB
Auth](https://www.edgedb.com/docs/guides/auth/index) from a vanilla NodeJS HTTP server. It serves as
a blueprint for building all of the low-level pieces of interacting with the EdgeDB authentication
server.

Please see the [EdgeDB Auth guide](https://www.edgedb.com/docs/guides/auth/index) for more
information on how these different piece fit into the various available authentication flows.

## Getting Started

### Requirements

- Node.js v20
- npm v10
- EdgeDB CLI v4

#### Nix

You can use the included Nix flake to manage the binary dependencies of this project (Node, npm, and
the EdgeDB CLI). It also includes `httpie` which can be useful for testing endpoints.

### Install dependencies

```bash
npm install
```

### Initialize project

```bash
edgedb project init
```

### Configure Auth Extension

Follow the configuration guidance in [the
docs](https://www.edgedb.com/docs/guides/auth/index#extension-configuration). You can launch the
built-in UI using the EdgeDB CLI:

```bash
edgedb ui
```

### Start server

```bash
node index.js
```
