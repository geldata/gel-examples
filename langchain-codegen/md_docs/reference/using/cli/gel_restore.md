# gel restore

Restore a Gel branch from a backup file.

```cli-synopsis
gel restore [<options>] <path>
```

## Description

gel restore is a terminal command used to restore a Gel branch branch from a backup file. The backup is restored to the currently active branch.

The backup cannot be restored to a branch with any existing schema. As a result, you should restore to one of these targets: a new empty branch which can be created using gel branch create with the --empty option a new empty branch if your instance is running EdgeDB versions prior to 5 an existing branch that has been wiped with the appropriate wipe command (either gel branch wipe or gel database wipe; note that this will destroy all data and schema currently in that branch/database)

## Options

The restore command restores the backup file into the active branch. For specifying the connection target see connection options.

