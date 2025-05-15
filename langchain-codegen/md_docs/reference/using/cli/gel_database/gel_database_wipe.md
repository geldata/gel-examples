# gel database wipe

Destroy the contents of a database

```cli-synopsis
gel database wipe [<options>]
```

EdgeDB 5.0 introduced branches to replace databases. This command works on instances running versions prior to EdgeDB 5.0. If you are running a newer version of EdgeDB or Gel, you will instead use gel branch wipe.

## Description

gel database wipe is a terminal command equivalent to reset schema to initial.

The database wiped will be one of these values: the value passed for the --database/-d option, the value of GEL_DATABASE, or main. The contents of the database will be destroyed and the schema reset to its state before any migrations, but the database itself will be preserved.

## Options

The database wipe command runs in the Gel instance it is connected to. For specifying the connection target see connection options.

