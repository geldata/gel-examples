# ext::vectorstore

The ext::vectorstore extension package provides simplified vectorstore workflows for Gel, built on top of the pgvector integration. It includes predefined vector dimensions and a base schema for vector storage records.

## Enabling the extension

The extension package can be installed using the gel extension CLI command:

```bash
$ gel extension install vectorstore
```

It can be enabled using the extension mechanism:

```sdl
using extension vectorstore;
```

The Vectorstore extension is designed to be used in combination with the Vectostore Python binding or other integrations, rather than on its own.

## Types

