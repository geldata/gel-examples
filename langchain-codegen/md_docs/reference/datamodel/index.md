# Schema

Gel schema is a high-level description of your application’s data model. In the schema, you define your types, links, access policies, functions, triggers, constraints, indexes, and more.

Gel schema is strictly typed and is high-level enough to be mapped directly to mainstream programming languages and back.

## Schema Definition Language

Migrations are sequences of data definition language (DDL) commands. DDL is a low-level language that tells the database exactly how to change the schema. You typically won’t need to write any DDL by hand; the Gel server will generate it for you.

For a full guide on migrations, refer to the Creating and applying migrations guide or the migrations reference section.

Example:

```sdl
# dbschema/default.gel

type Movie {
  required title: str;
  required director: Person;
}

type Person {
  required name: str;
}
```

## Migrations and DDL

Gel’s baked-in migration system lets you painlessly evolve your schema over time. Just update the contents of your .gel file(s) and use the Gel CLI to create and apply migrations.

```bash
$ gel migration create
Created dbschema/migrations/00001.edgeql
$ gel migrate
Applied dbschema/migrations/00001.edgeql
```

Migrations are sequences of data definition language (DDL) commands. DDL is a low level language that tells the database how exactly to change the schema. Don’t worry, you won’t need to write any DDL directly, the Gel server will generate it for you.

For a full guide on migrations, refer to the Creating and applying migrations guide or the migrations reference section.

## Instances, branches, and modules

Gel is like a stack of containers:

