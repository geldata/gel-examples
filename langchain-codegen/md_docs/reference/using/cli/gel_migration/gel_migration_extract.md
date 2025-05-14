# gel migration extract

Extract migration history from the database and write it to /dbschema/migrations. Useful when a direct DDL command has been used to change the schema and now gel migrate will not comply because the database migration history is ahead of the migration history inside /dbschema/migrations.

This can also be useful if the migrations on the file system have been lost or deleted.

## Options

The migration extract command runs on the database it is connected to. For specifying the connection target see connection options.

