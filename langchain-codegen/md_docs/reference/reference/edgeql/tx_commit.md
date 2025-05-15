# Commit

commit – commit the current transaction

```edgeql-synopsis
commit ;
```

## Example

Commit the current transaction:

```edgeql
commit;
```

## Description

The commit command  commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs.

| --- |
| See also |
| Reference > EdgeQL > Start transaction |
| Reference > EdgeQL > Rollabck |
| Reference > EdgeQL > Declare savepoint |
| Reference > EdgeQL > Rollback to savepoint |
| Reference > EdgeQL > Release savepoint |

