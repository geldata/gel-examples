# gel branch switch

Change the currently active branch

```cli-synopsis
gel branch switch [<options>] <name>
```

This CLI command requires Gel (or EdgeDB version 5.0 or later.) Earlier versions did not feature branches and instead featured databases. Databases offered no direct analog to switching. To run a single command on a different branch, use the -d <dbname> or --database=<dbname> options described in Connection flags To change the database for all commands, set the GEL_DATABASE environment variable described in Connection flags To change the database for all commands in a project, you may update the credentials.json file’s database value. To find that file for your project, run gel info to get the config path and navigate to /<config-path>/credentials. You may use \connect <dbname> or \c <dbname> to change the connected database while in a REPL session. See the gel database command suite for other database management commands.

## Options

The branch switch command runs in the Gel instance it is connected to. For specifying the connection target see connection options.

