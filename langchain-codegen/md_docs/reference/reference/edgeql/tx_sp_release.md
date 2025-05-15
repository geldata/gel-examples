# Release savepoint

release savepoint – release a previously declared savepoint

```edgeql-synopsis
release savepoint <savepoint-name> ;
```

## Description

release savepoint destroys a savepoint previously defined in the current transaction.

Destroying a savepoint makes it unavailable as a rollback point, but it has no other user visible behavior. It does not undo the effects of commands executed after the savepoint was established. (To do that, see rollback to savepoint.)

release savepoint also destroys all savepoints that were established after the named savepoint was established.

## Example

```edgeql
start transaction;
# ...
declare savepoint f1;
# ...
release savepoint f1;
# ...
rollback;
```

| --- |
| See also |
| Reference > EdgeQL > Start transaction |
| Reference > EdgeQL > Commit |
| Reference > EdgeQL > Rollabck |
| Reference > EdgeQL > Declare savepoint |
| Reference > EdgeQL > Rollback to savepoint |

