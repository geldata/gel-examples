# CLI

The gel command-line interface (CLI) provides an idiomatic way to install Gel, spin up local instances, open a REPL, execute queries, manage auth roles, introspect schema, create migrations, and more.

You can install it with one shell command.

On Linux or MacOS, run the following in your terminal and follow the on-screen instructions:

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://www.geldata.com/sh | sh
```

For Windows, the installation script is:

```powershell
PS> iwr https://www.geldata.com/ps1 -useb | iex
```

All commands respect a common set of connection options, which let you specify a target instance. This instance can be local to your machine or hosted remotely.

To install the nightly version of the CLI (not to be confused with the nightly version of Gel itself!) use this command:

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://www.geldata.com/sh | \
  sh -s -- --nightly
```

Command-line tools contain just one binary, so to remove it on Linux or macOS run:

```bash
$ rm "$(which gel)"
```

To remove all configuration files, run gel info to list the directories where Gel stores data, then use rm -rf <dir> to delete those directories.

If the command-line tool was installed by the user (recommended) then it will also remove the binary.

If you’ve used gel commands you can also delete instances and server packages, prior to removing the tool:

```bash
$ gel instance destroy <instance_name>
```

To list instances and server versions use the following commands respectively:

```bash
$ gel instance status
$ gel server list-versions --installed-only
```

You can customize the behavior of the gel CLI and REPL with a global configuration file. The file is called cli.toml and its location differs between operating systems. Use gel info to find the “Config” directory on your system.

The cli.toml has the following structure. All fields are optional:

```default
[shell]
expand-strings = true         # Stop escaping newlines in quoted strings
history-size = 10000          # Set number of entries retained in history
implicit-properties = false   # Print implicit properties of objects
limit = 100                   # Set implicit LIMIT
                              # Defaults to 100, specify 0 to disable
input-mode = "emacs"          # Set input mode. One of: vi, emacs
output-format = "default"     # Set output format.
                              # One of: default, json, json-pretty,
                              # json-lines
print-stats = "off"           # Print statistics on each query.
                              # One of: off, query, detailed
verbose-errors = false        # Print all errors with maximum verbosity
```

Notes on network usage

