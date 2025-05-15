# gel migration apply

Once the migration scripts are in place the changes can be applied to the database by this command:

```cli-synopsis
gel migration apply [<options>]
```

The tool will find all the unapplied migrations in dbschema/migrations/ directory and sequentially run them on the target instance.

## Options

The migration apply command runs on the database it is connected to. For specifying the connection target see connection options.

