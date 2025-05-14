# Rollback to savepoint

rollback to savepoint – rollback to a savepoint within the current transaction

```edgeql-synopsis
rollback to savepoint <savepoint-name> ;
```

## Description

Rollback all commands that were executed after the savepoint was established. The savepoint remains valid and can be rolled back to again later, if needed.

rollback to savepoint implicitly destroys all savepoints that were established after the named savepoint.

## Example

```edgeql
start transaction;
# ...
declare savepoint f1;
# ...
rollback to savepoint f1;
# ...
rollback;
```

| --- |
| See also |
| Reference > EdgeQL > Start transaction |
| Reference > EdgeQL > Commit |
| Reference > EdgeQL > Rollabck |
| Reference > EdgeQL > Declare savepoint |
| Reference > EdgeQL > Release savepoint |

