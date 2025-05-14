# gel migration edit

Edit migration file.

```cli-synopsis
gel migration edit [<options>]
```

Invokes $EDITOR on the last migration file, and then fixes migration id after editor exits. Usually should be used for migrations that haven’t been applied yet.

## Options

The migration edit command runs on the database it is connected to. For specifying the connection target see connection options.

