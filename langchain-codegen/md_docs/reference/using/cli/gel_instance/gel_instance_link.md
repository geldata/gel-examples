# gel instance link

Authenticate a connection to a remote Gel instance and assign an instance name to simplify future connections.

```cli-synopsis
gel instance link [<options>] <name>
```

## Description

gel instance link is a terminal command used to bind a set of connection credentials to an instance name. This is typically used as a way to simplify connecting to remote Gel database instances. Usually there’s no need to do this for local instances as gel project init will already set up a named instance.

Unlike other gel instance sub-commands, gel instance link is recommended to link self-hosted instances. This can make other operations like migrations, dumps, and restores more convenient. Linking is not required for Gel Cloud instances. They can always be accessed via CLI using <org-name>/<instance-name>.

## Options

The instance link command uses the standard connection options for specifying the instance to be linked.

