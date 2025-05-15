# gel branch wipe

Destroy the contents of a branch

```cli-synopsis
gel branch wipe [<options>] <name>
```

## Description

The contents of the branch will be destroyed and the schema reset to its state before any migrations, but the branch itself will be preserved.

gel branch wipe is a terminal command equivalent to reset schema to initial.

## Options

The branch wipe command runs in the Gel instance it is connected to. For specifying the connection target see connection options.

