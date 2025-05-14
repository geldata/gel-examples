# gel instance revert

Revert a major instance upgrade.

```cli-synopsis
gel instance revert [<options>] <name>
```

## Description

When gel instance upgrade performs a major version upgrade on an instance the old instance data is kept around. The gel instance revert command removes the new instance version and replaces it with the old copy. It also ensures that the previous version of Gel server is used to run it.

The gel instance revert command is not intended for use with self-hosted instances.

## Options

