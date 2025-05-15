# Setting up your environment

Use git to clone the Next.js starter template into a new directory called flashcards. This will create a fully configured Next.js project and a local Gel instance with an empty schema. You will see the database instance being created and the project being initialized. You are now ready to start building the application.

```sh
$ git clone \
    git@github.com:geldata/quickstart-nextjs.git \
    flashcards
$ cd flashcards
$ npm install
$ npx gel project init
```

Explore the empty database by starting our REPL from the project root.

```sh
$ npx gel
```

Try the following queries which will work without any schema defined.

```edgeql-repl
db> select 42;
{42}
db> select sum({1, 2, 3});
{6}
db> with cards := {
...   (
...     front := "What is the highest mountain in the world?",
...     back := "Mount Everest",
...   ),
...   (
...     front := "Which ocean contains the deepest trench on Earth?",
...     back := "The Pacific Ocean",
...   ),
... }
... select cards order by random() limit 1;
{
  (
    front := "What is the highest mountain in the world?",
    back := "Mount Everest",
  )
}
```

Fun! You will create a proper data model for the application in the next step, but for now, take a look around the project you’ve just created. Most of the project files will be familiar if you’ve worked with Next.js before. Here are the files that integrate Gel:

### gel.toml

```toml
[instance]
server-version = 6.1

[hooks]
schema.update.after = "npx @gel/generate edgeql-js"
```

### dbschema/default.gel

```sdl
module default {

}
```

### lib/gel.ts

```typescript
import { createClient } from "gel";

export const client = createClient();
```

