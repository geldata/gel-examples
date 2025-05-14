# Interfaces Generator

The interfaces generator introspects your schema and generates file containing TypeScript interfaces that correspond to each object type. This is useful for writing typesafe code to interact with Gel.

## Installation

To get started, install the following packages.

Install the gel package.

```bash
$ npm install gel       # npm users
$ yarn add gel          # yarn users
$ pnpm add gel          # pnpm users
$ bun add gel           # bun users
$ deno add npm:gel      # deno users
```

Then install @gel/generate as a dev dependency.

```bash
$ npm install @gel/generate --save-dev      # npm users
$ yarn add @gel/generate --dev              # yarn users
$ pnpm add --dev @gel/generate              # pnpm users
$ bun add --dev @gel/generate               # bun users
$ deno add --dev npm:@gel/generate          # deno users
```

## Generation

Assume your database contains the following Gel schema.

```sdl
module default {
  type Person {
    required name: str;
  }

  scalar type Genre extending enum<Horror, Comedy, Drama>;

  type Movie {
    required title: str;
    genre: Genre;
    multi actors: Person;
  }
}
```

The following command will run the interfaces generator.

### Node.js

```bash
$ npx @gel/generate interfaces
```

### Deno

```bash
$ deno run --allow-all npm:@gel/generate interfaces
```

### Bun

```bash
$ bunx @gel/generate interfaces
```

This will introspect your schema and generate TypeScript interfaces that correspond to each object type. By default, these interfaces will be written to a single file called interfaces.ts into the dbschema directory in your project root. The file will contain the following contents (roughly):

```typescript
export interface Person {
  id: string;
  name: string;
}

export type Genre = "Horror" | "Comedy" | "Drama";

export interface Movie {
  id: string;
  title: string;
  genre?: Genre | null;
  actors: Person[];
}
```

Any types declared in a non-default module  will be generated into an accordingly named namespace.

Generators work by connecting to the database to get information about the current state of the schema. Make sure you run the generators again any time the schema changes so that the generated code is in-sync with the current state of the schema. The easiest way to do this is to add the generator command to the schema.update.after hook in your gel.toml.

## Usage

The generated interfaces can be imported like so.

```typescript
import {Genre, Movie} from "./dbschema/interfaces";
```

You will need to manipulate the generated interfaces to match your application’s needs. For example, you may wish to strip the id property for a createMovie mutation.

```typescript
function createMovie(data: Omit<Movie, "id">) {
  // ...
}
```

Refer to the TypeScript docs for information about built-in utility types like Pick, Omit, and Partial.

For convenience, the file also exports a namespace called helper containing a couple useful utilities for extracting the properties or links from an object type interface.

```typescript
import type { Movie, helper } from "./dbschema/interfaces";

type MovieProperties = helper.Props<Movie>;
// { id: string; title: string; ... }

type MovieLinks = helper.Links<Movie>;
// { actors: Person[]; }
```

