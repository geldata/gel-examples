# Projects

A Gel project represents a codebase that shares a single Gel database instance. Projects make local development simpler by automatically managing database connections without requiring you to specify credentials each time you run a command.

Key concepts:

Benefits of projects:

Projects are intended only for local development. In production environments, you should provide instance credentials using environment variables. See Connection parameters for details.

## Creating a new Gel project

To get started, navigate to the root directory of your codebase in a shell and run gel project init. You’ll see something like this:

```bash
$ gel project init
No `gel.toml` found in this repo or above.
Do you want to initialize a new project? [Y/n]
> Y
Checking Gel versions...
Specify the version of Gel to use with this project [6.4]:
> # left blank for default
Specify the name of Gel instance to use with this project:
> my_instance
Initializing Gel instance...
Bootstrap complete. Server is up and running now.
Project initialialized.
```

This process:

## Working with existing projects

If you’ve cloned a repository that already contains a gel.toml file, simply run gel project init in the project directory. This will:

This makes it easy to begin working with Gel-backed applications without manual configuration.

## Unlinking a project

To remove the link between your project and its instance, run gel project unlink anywhere inside the project. This doesn’t affect the instance itself, which continues running. After unlinking, you can run gel project init again to link to a different instance.

## Using projects with remote instances

You can also link a project to a non-local Gel instance (such as a shared staging database). First, create a link to the remote instance:

```bash
$ gel instance link
Specify the host of the server [default: localhost]:
> 192.168.4.2
Specify the port of the server [default: 5656]:
> 10818
Specify the database user [default: admin]:
> admin
Specify the branch name [default: main]:
> main
Unknown server certificate: SHA1:c38a7a90429b033dfaf7a81e08112a9d58d97286. Trust? [y/N]
> y
Password for 'admin':
Specify a new instance name for the remote server [default: 192_168_4_2_10818]:
> staging_db
Successfully linked to remote instance. To connect run:
  gel -I staging_db
```

Then run gel project init and specify staging_db as the instance name.

When using an existing instance, make sure that the project source tree is in sync with the current migration revision of the instance. If the current revision in the database doesn’t exist under dbschema/migrations/, it’ll raise an error when trying to migrate or create new migrations. In this case, update your local source tree to the revision that matches the current revision of the database.

## gel.toml

The gel.toml file is created in the project root after running gel project init. If this file is present in a directory, it signals to the CLI and client bindings that the directory is an instance-linked Gel project. It supports the following configuration settings:

