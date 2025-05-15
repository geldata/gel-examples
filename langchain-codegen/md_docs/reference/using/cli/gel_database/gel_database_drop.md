# gel database drop

Drop a database.

```cli-synopsis
gel database drop [<options>] <name>
```

EdgeDB 5.0 introduced branches to replace databases. This command works on instances running versions prior to EdgeDB 5.0. If you are running a newer version of Gel, you will instead use gel branch drop.

## Description

gel database drop is a terminal command equivalent to drop database.

## Options

The database drop command runs in the Gel instance it is connected to. For specifying the connection target see connection options.

