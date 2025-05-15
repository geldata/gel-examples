# Using the CLI

To initialize a new project:

```bash
$ gel project init
```

If an gel.toml file exists in the current directory, it will initialize a new project according to the settings defined in it.

Otherwise, a new project will be initialized and an gel.toml file and dbschema directory will be generated. For details on using projects, see the dedicated guide.

Once initialized, you can run the CLI commands below without additional connection options. If you don’t set up a project, you’ll need to use flags to specify the target instance for each command.

Explicitly create a new Gel instance my_instance:

```bash
$ gel instance create my_instance
```

Create a branch:

```bash
$ gel branch create feature
OK: CREATE
```

Configure passwordless access (such as to a local development database):

```bash
$ gel configure insert Auth \
> --comment 'passwordless access' \
> --priority 1 \
> --method Trust
OK: CONFIGURE INSTANCE
```

Configure access that checks password (with a higher priority):

```bash
$ gel configure insert Auth \
> --comment 'password is required' \
> --priority 0 \
> --method SCRAM
OK: CONFIGURE INSTANCE
```

Connect to the default project branch:

```bash
$ gel
                    ▄██▄
  ▄▄▄▄▄      ▄▄▄    ████
▄███████▄ ▄███████▄ ████
▀███████▀ ▀███▀▀▀▀▀ ████
  ▀▀▀▀▀      ▀▀▀     ▀▀
 ▀▄▄▄▄▄▀
   ▀▀▀
Gel 6.0-rc.1+673117d (repl 6.2.0-dev)
Type \help for help, \quit to quit.
```

Connect to some specific branch:

```bash
$ gel -b feature
Gel 6.0-rc.1+673117d (repl 6.2.0-dev)
Type \help for help, \quit to quit.
special_db>
```

