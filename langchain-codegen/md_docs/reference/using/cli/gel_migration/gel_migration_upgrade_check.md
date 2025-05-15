# gel migration upgrade-check

Checks your schema against a different Gel version.

```cli-synopsis
gel migration upgrade-check [<options>]
```

The upgrade check is performed automatically when you perform an upgrade.

## Description

By default, upgrade-check checks your schema against the latest stable release of Gel. You can add --to-version <version>, --to-testing, --to-nightly, or --to-channel <channel> to check against a specific version.

## Options

The migration upgrade-check command runs on the database it is connected to. For specifying the connection target see connection options.

