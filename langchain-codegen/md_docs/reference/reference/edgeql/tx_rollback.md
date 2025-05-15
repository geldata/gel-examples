# Rollback

rollback – abort the current transaction

```edgeql-synopsis
rollback ;
```

## Example

Abort the current transaction:

```edgeql
rollback;
```

## Description

The rollback command rolls back the current transaction and causes all updates made by the transaction to be discarded.

| --- |
| See also |
| Reference > EdgeQL > Start transaction |
| Reference > EdgeQL > Commit |
| Reference > EdgeQL > Declare savepoint |
| Reference > EdgeQL > Rollback to savepoint |
| Reference > EdgeQL > Release savepoint |

