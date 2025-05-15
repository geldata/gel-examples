# Extensions

Extensions are the way Gel can be extended with more functionality. They can add new types, scalars, functions, etc., but, more importantly, they can add new ways of interacting with the database.

## Built-in extensions

There are a few built-in extensions available:

To enable these extensions, add a using statement at the top level of your schema:

```sdl
using extension auth;
# or / and
using extension ai;
```

## Standalone extensions

Additionally, standalone extension packages can be installed on local project-managed instances via the CLI, with postgis being a notable example.

List installed extensions:

```bash
$ gel extension list
┌─────────┬─────────┐
│ Name    │ Version │
└─────────┴─────────┘
```

List available extensions:

```bash
$ gel extension list-available
┌─────────┬───────────────┐
│ Name    │ Version       │
│ postgis │ 3.4.3+6b82d77 │
└─────────┴───────────────┘
```

Install the postgis extension:

```bash
$ gel extension install postgis
Found extension package: postgis version 3.4.3+6b82d77
00:00:03 [====================] 22.49 MiB/22.49 MiB
Extension 'postgis' installed successfully.
```

Check that extension is installed:

```bash
$ gel extension list
┌─────────┬───────────────┐
│ Name    │ Version       │
│ postgis │ 3.4.3+6b82d77 │
└─────────┴───────────────┘
```

After installing extensions, make sure to restart your instance:

```bash
$ gel instance restart
```

Standalone extensions can now be declared in the schema, same as built-in extensions:

```sdl
using extension postgis;
```

To restore a dump that uses a standalone extension, that extension must be installed before the restore process.

## Using extensions

## DDL commands

This section describes the low-level DDL commands for creating and dropping extensions. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

