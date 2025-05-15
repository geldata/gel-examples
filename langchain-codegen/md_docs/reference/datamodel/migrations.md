# Migrations

Gel’s baked-in migration system lets you painlessly evolve your schema over time. Just update the contents of your .gel file(s) and use the Gel CLI to create and apply migrations.

```bash
$ gel migration create
Created dbschema/migrations/00001.edgeql

$ gel migrate
Applied dbschema/migrations/00001.edgeql
```

Refer to the creating and applying migrations guide for more information on how to use the migration system.

This document describes how migrations are implemented.

## The migrations flow

The migration flow is as follows:

## Command line tools

The two most important commands are:

## Automatic migrations

Sometimes when you’re prototyping something new you don’t want to spend time worrying about migrations. There’s no data to lose and not much code that depends on the schema just yet.

For this use case you can use the gel watch --migrate command, which will monitor your .gel files and automatically create and apply migrations for you in the background.

## Data definition language (DDL)

The migration plan is a sequence of DDL commands. DDL commands are low-level instructions that describe the changes to the schema.

SDL and your .gel files are like a 3D printer: you design the final shape, and the system puts a database together for you. Using DDL is like building a house the traditional way: to add a window, you first need a frame; to have a frame, you need a wall; and so on.

If your schema looks like this:

```sdl
type User {
  required name: str;
}
```

then the corresponding DDL might look like this:

```edgeql
create type User {
  create required property name: str;
}
```

There are some circumstances where users might want to use DDL directly. But in most cases you just need to learn how to read them to understand the migration plan. Luckily, the DDL and SDL syntaxes were designed in tandem and are very similar.

Most documentation pages on Gel’s schema have a section about DDL commands, e.g. object types DDL.

## Migration DDL commands

Migrations themselves are a sequence of special DDL commands.

Like all DDL commands, start migration and other migration commands are considered low-level. Users are encouraged to use the built-in migration tools instead.

However, if you want to implement your own migration tools, this section will give you a good understanding of how Gel migrations work under the hood.

## Migration rewrites DDL commands

Migration rewrites allow you to change the migration history as long as your final schema matches the current database schema.

