# Projects

It can be inconvenient to pass the -I flag every time you wish to run a CLI command.

```bash
$ gel migration create -I my_instance
```

That’s one of the reasons we introduced the concept of an Gel project. A project is a directory on your file system that is associated (“linked”) with a Gel instance.

Projects are intended to make local development easier! They only exist on your local machine and are managed with the CLI. When deploying Gel for production, you will typically pass connection information to the client library using environment variables.

When you’re inside a project, all CLI commands will be applied against the linked instance by default (no CLI flags required).

```bash
$ gel migration create
```

The same is true for all Gel client libraries (discussed in more depth in the Clients section). If the following file lives inside a Gel project directory, createClient will discover the project and connect to its linked instance with no additional configuration.

```typescript
// clientTest.js
import {createClient} from 'gel';

const client = createClient();
await client.query("select 5");
```

## Initializing

To initialize a project, create a new directory and run gel project init inside it. You’ll see something like this:

```bash
$ gel project init
No `gel.toml` found in this repo or above.
Do you want to initialize a new project? [Y/n]
> Y
Specify the name of Gel instance to use with this project
[default: my_instance]:
> my_instance
Checking Gel versions...
Specify the version of Gel to use with this project [default: x.x]:
> # (left blank for default)
...
Successfully installed x.x+cc4f3b5
Initializing Gel instance...
Applying migrations...
Everything is up to date. Revision initial
Project initialized.
To connect to my_instance, run `gel`
```

This command does a couple important things.

Every project maps one-to-one to a particular Gel instance. From inside a project directory, you can run gel project info to see information about the current project.

```bash
$ gel project info
┌───────────────┬──────────────────────────────────────────┐
│ Instance name │ my_instance                              │
│ Project root  │ /path/to/project                         │
└───────────────┴──────────────────────────────────────────┘
```

## Connection

As long as you are inside the project directory, all CLI commands will be executed against the project-linked instance. For instance, you can simply run gel to open a REPL.

```bash
$ gel
Gel x.x+cc4f3b5 (repl x.x+da2788e)
Type \help for help, \quit to quit.
my_instance:main> select "Hello world!";
```

By contrast, if you leave the project directory, the CLI will no longer know which instance to connect to. You can solve this by specifing an instance name with the -I flag.

```bash
$ cd ~
$ gel
gel error: no `gel.toml` found and no connection options are specified
  Hint: Run `gel project init` or use any of `-H`, `-P`, `-I` arguments to
  specify connection parameters. See `--help` for details
$ gel -I my_instance
Gel x.x+cc4f3b5 (repl x.x+da2788e)
Type \help for help, \quit to quit.
my_instance:main>
```

Similarly, client libraries will auto-connect to the project’s linked instance without additional configuration.

## Using remote instances

You may want to initialize a project that points to a remote Gel instance. This is totally a valid case and Gel fully supports it! Before running gel project init, you just need to create an alias for the remote instance using gel instance link, like so:

```bash
$ gel instance link
Specify server host [default: localhost]:
> 192.168.4.2
Specify server port [default: 5656]:
> 10818
Specify database user [default: admin]:
> admin
Specify branch [default: main]:
> main
Unknown server certificate: SHA1:c38a7a90429b033dfaf7a81e08112a9d58d97286.
Trust? [y/N]
> y
Password for 'admin':
Specify a new instance name for the remote server [default: abcd]:
> staging_db
Successfully linked to remote instance. To connect run:
  gel -I staging_db
```

After receiving the necessary connection information, this command links the remote instance to a local alias "staging_db". You can use this as instance name in CLI commands.

```default
$ gel -I staging_db
gel>
```

To initialize a project that uses the remote instance, provide this alias when prompted for an instance name during the gel project init workflow.

## Unlinking

An instance can be unlinked from a project. This leaves the instance running but effectively “uninitializes” the project. The gel.toml and dbschema are left untouched.

```bash
$ gel project unlink
```

If you wish to delete the instance as well, use the -D flag.

```bash
$ gel project unlink -D
```

## Upgrading

A standalone instance (not linked to a project) can be upgraded with the gel instance upgrade command.

```bash
$ gel project upgrade --to-latest
$ gel project upgrade --to-nightly
$ gel project upgrade --to-version x.x
```

## See info

You can see the location of a project and the name of its linked instance.

```bash
$ gel project info
┌───────────────┬──────────────────────────────────────────┐
│ Instance name │ my_app                                   │
│ Project root  │ /path/to/my_app                          │
└───────────────┴──────────────────────────────────────────┘
```

